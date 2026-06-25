import { ImageData } from "../interfaces/image.interface.js";

export interface IImageRepository {
    addImages(userId: string, images: { title: string; imageUrl: string; }[]): Promise<ImageData[]>;
    getAllImages(userId: string, currentPage: number, limit: number): Promise<{ images: ImageData[]; total: number; }>;
    updateImage(imageId: string, updateData: Partial<Omit<ImageData, "imageId">>): Promise<ImageData | null>;
    deleteImage(imageId: string): Promise<boolean>;
    updatePositions(reorderedItems: { imageId: string; position: number }[]): Promise<void>;
}