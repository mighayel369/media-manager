import { HydratedDocument } from "mongoose";
import { BaseRepository } from "../base/base.repository.js";
import { Image, IImage } from "../../models/image.model.js";
import { IImageRepository } from "../interfaces/image-repository.interface.js";
import { CreateImagePayload, ImageDTO, PaginatedImages, ReorderImagePayload, UpdateImagePayload } from "../interfaces/image.interface.js";
import mongoose, { Types } from "mongoose";
type ImageDocument = HydratedDocument<IImage>;

export class ImageRepository extends BaseRepository<IImage, ImageDTO>
    implements IImageRepository {

    constructor() {
        super(Image);
    }

    protected toDTO(doc: ImageDocument): ImageDTO {
        return {
            imageId: doc._id.toString(),
            title: doc.title,
            imageUrl: doc.imageUrl,
            position: doc.position
        };
    }

    async addImages(
        userId: string,
        images: CreateImagePayload[]
    ): Promise<ImageDTO[]> {

        const lastImage = await Image
            .findOne({ userId })
            .sort({ position: -1 });

        let nextPosition =
            lastImage ? lastImage.position + 1 : 0;

        const docs = images.map(img => ({
            userId: new Types.ObjectId(userId),
            title: img.title,
            imageUrl: img.imageUrl,
            position: nextPosition++
        }));

        const savedDocs = await Image.insertMany(docs);

        return this.toDTOList(savedDocs);
    }

    async updateImage(
        imageId: string,
        update: UpdateImagePayload
    ): Promise<ImageDTO | null> {

        return this.updateById(imageId, update);
    }

    async deleteImage(imageId: string): Promise<boolean> {

        const deletedImage =
            await Image.findByIdAndDelete(imageId);

        if (!deletedImage) {
            return false;
        }

        await Image.updateMany(
            {
                userId: deletedImage.userId,
                position: { $gt: deletedImage.position }
            },
            {
                $inc: {
                    position: -1
                }
            }
        );

        return true;
    }

    async getAllImages(
        userId: string,
        currentPage: number,
        limit: number
    ): Promise<PaginatedImages> {

        const skip = (currentPage - 1) * limit;

        const [docs, total] = await Promise.all([

            Image.find({ userId })
                .sort({ position: 1 })
                .skip(skip)
                .limit(limit),

            Image.countDocuments({ userId })

        ]);

        return {
            images: this.toDTOList(docs),
            total
        };
    }

    async updatePositions(userId: string, reorderedItems: ReorderImagePayload[]): Promise<void> {

        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await Image.bulkWrite(
                reorderedItems.map(item => ({
                    updateOne: {
                        filter: {
                            _id: new Types.ObjectId(item.imageId),
                            userId: new Types.ObjectId(userId)
                        },
                        update: {
                            $set: {
                                position: item.position
                            }
                        }
                    }
                })),
                { session }
            );
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}