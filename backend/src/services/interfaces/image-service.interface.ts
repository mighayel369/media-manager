import { ImageData } from "../../repositories/interfaces/image.interface.js";
import { updateImageRequest } from "../../validators/image/update.image.validate.js";
import { IReorderItem } from "../../validators/image/reorder.image.validate.js";


export interface IUpdateImagePayload extends updateImageRequest {
    imageFile?: Express.Multer.File;
}

export interface IImageService {
    addImages(userId: string, files: Express.Multer.File[], titles: string[]): Promise<ImageData[]>;
    updateImage(imageId: string, updatePayload: IUpdateImagePayload): Promise<ImageData | null>;
    removeImage(imageId: string): Promise<boolean>;
    reorderImage(reorderedItems: IReorderItem[]): Promise<void>;
    getAllImages(userId: string, currentPage: number, limit: number): Promise<{ images: ImageData[]; total: number;}>;
}