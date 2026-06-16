import { image } from "../../models/image.model.js";
import { IImageRepository } from "../interfaces/image-repository.interface.js";
import { ImageData } from "../interfaces/image.interface.js";

export class ImageRepository implements IImageRepository {
    async addImage(userId: string, title: string, imageUrl: string): Promise<ImageData> {
        const lastImageData = await image.findOne().sort("-position").exec();
        const nextPosition = lastImageData ? lastImageData.position + 1 : 0;

        const newImage = new image({ userId, title, imageUrl, position: nextPosition });
        const savedDoc = await newImage.save();

        return {
            imageId: (savedDoc._id).toString(),
            title: savedDoc.title,
            imageUrl: savedDoc.imageUrl,
            position: savedDoc.position
        };
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

    async getAllImages(userId: string): Promise<ImageData[]> {
        const docs = await image.find({ userId }).sort("position").exec();
        return docs.map(doc => ({
            imageId: (doc._id).toString(),
            title: doc.title,
            imageUrl: doc.imageUrl,
            position: doc.position
        }));
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