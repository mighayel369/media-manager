import { ImageData } from "../../repositories/interfaces/image.interface.js";
import { addImageBody } from "../../validators/image/add.image.validate.js";
import { updateImageRequest } from "../../validators/image/update.image.validate.js";
import { IReorderItem } from "../../validators/image/reorder.image.validate.js";

export interface ISaveImagePayload extends addImageBody {
    imageFile: Express.Multer.File;
}

export interface IUpdateImagePayload extends updateImageRequest {
    imageFile?: Express.Multer.File;
}

export interface IImageService {
    addImage(userId:string,payload: ISaveImagePayload): Promise<ImageData>;
    updateImage(imageId: string, updatePayload: IUpdateImagePayload): Promise<ImageData | null>;
    removeImage(imageId: string): Promise<boolean>;
    reorderImage(reorderedItems: IReorderItem[]): Promise<void>;
    getAllImages(userId:string): Promise<ImageData[]>;
}