import { image } from "../../models/image.model.js";
import { IImageRepository } from "../interfaces/image-repository.interface.js";
import { ImageData } from "../interfaces/image.interface.js";

export class ImageRepository implements IImageRepository {
    async addImages(userId: string, images: { title: string; imageUrl: string; }[]): Promise<ImageData[]> {

        const lastImage = await image.findOne().sort("-position").exec();

        let nextPosition = lastImage ? lastImage.position + 1 : 0;

        const docs = images.map(img => ({
            userId,
            title: img.title,
            imageUrl: img.imageUrl,
            position: nextPosition++
        }));

        const savedDocs = await image.insertMany(docs);

        return savedDocs.map(doc => ({
            imageId: doc._id.toString(),
            title: doc.title,
            imageUrl: doc.imageUrl,
            position: doc.position
        }));
    }

    async updateImage(imageId: string, updateData: Partial<Omit<ImageData, "imageId">>): Promise<ImageData | null> {
        const updatedImage = await image.findByIdAndUpdate(imageId, { $set: updateData }, { new: true }).exec();

        if (!updatedImage) return null;

        return {
            imageId: (updatedImage._id).toString(),
            title: updatedImage.title,
            imageUrl: updatedImage.imageUrl,
            position: updatedImage.position
        };
    }

    async deleteImage(imageId: string): Promise<boolean> {
        const imageDoc = await image.findById(imageId);
        if (!imageDoc) return false

        const deletedPosition = imageDoc.position
        await image.findByIdAndDelete(imageId);

        await image.updateMany({ position: { $gt: deletedPosition }, userId: imageDoc.userId }, { $inc: { position: -1 } })
        return true
    }
    async getAllImages(userId: string, currentPage: number, limit: number): Promise<{ images: ImageData[]; total: number; }> {
        const skip = (currentPage - 1) * limit;

        const [docs, total] = await Promise.all([
            image
                .find({ userId })
                .sort({ position: 1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            image.countDocuments({ userId })
        ]);

        const images = docs.map(doc => ({
            imageId: doc._id.toString(),
            title: doc.title,
            imageUrl: doc.imageUrl,
            position: doc.position
        }));

        return {
            images,
            total
        };
    }

    async updatePositions(reorderedItems: { imageId: string; position: number; }[]): Promise<void> {
        const bulkUpdate = reorderedItems.map(item => ({
            updateOne: {
                filter: { _id: item.imageId },
                update: { $set: { position: item.position } }
            }
        }));
        await image.bulkWrite(bulkUpdate);
    }
}