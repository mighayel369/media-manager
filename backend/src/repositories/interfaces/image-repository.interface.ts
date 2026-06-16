import { ImageData } from "../interfaces/image.interface.js";

export interface IImageRepository {
    addImage(userId:string,title: string, imageUrl: string): Promise<ImageData>;
    getAllImages(userId:string): Promise<ImageData[]>;
    updateImage(imageId: string, updateData: Partial<Omit<ImageData, "imageId">>): Promise<ImageData | null>;
    deleteImage(imageId: string): Promise<boolean>;
    updatePositions(reorderedItems: { imageId: string; position: number }[]): Promise<void>;
}