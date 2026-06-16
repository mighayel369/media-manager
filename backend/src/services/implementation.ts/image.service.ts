import { IImageService, ISaveImagePayload, IUpdateImagePayload } from "../interfaces/image-service.interface.js";
import { AppError } from "../../errors/AppError.js";
import { ImageData } from "../../repositories/interfaces/image.interface.js";
import { IImageRepository } from "../../repositories/interfaces/image-repository.interface.js";
import { IUploadImage } from "../../infrastructure/storage/interface/upload-image.interface.js";
import { HttpStatus } from "../../constants/http_constants.js";
import { IReorderItem } from "../../validators/image/reorder.image.validate.js";

export class ImageService implements IImageService {
    constructor(
        private readonly _imageRepository: IImageRepository,
        private readonly _uploadImage: IUploadImage
    ) { }

    async addImage(userId: string, payload: ISaveImagePayload): Promise<ImageData> {
        const { imageFile, title } = payload;
        const imageUrl = await this._uploadImage.uploadImage(imageFile);
        return await this._imageRepository.addImage(userId, title, imageUrl);
    }

    async updateImage(imageId: string, updatePayload: IUpdateImagePayload): Promise<ImageData | null> {
        const { title, imageFile } = updatePayload;
        const fieldsToUpdate: Partial<Omit<ImageData, "imageId">> = {};

        if (title) fieldsToUpdate.title = title;

        if (imageFile) {
            const newImageUrl = await this._uploadImage.uploadImage(imageFile);
            fieldsToUpdate.imageUrl = newImageUrl;
        }

        return await this._imageRepository.updateImage(imageId, fieldsToUpdate);
    }

    async removeImage(imageId: string): Promise<boolean> {
        return await this._imageRepository.deleteImage(imageId);
    }

    async getAllImages(userId: string): Promise<ImageData[]> {
        return await this._imageRepository.getAllImages(userId);
    }

    async reorderImage(reorderedItems: IReorderItem[]): Promise<void> {
        if (!reorderedItems || reorderedItems.length === 0) {
            throw new AppError("No reorder dataset provided.", HttpStatus.BAD_REQUEST);
        }

        const repositoryPayload = reorderedItems.map(item => ({
            imageId: item.imageId,
            position: item.position
        }));

        await this._imageRepository.updatePositions(repositoryPayload);
    }
}