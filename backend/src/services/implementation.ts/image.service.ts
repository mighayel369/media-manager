import { IImageService, IUpdateImagePayload } from "../interfaces/image-service.interface.js";
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

    async addImages(userId: string, files: Express.Multer.File[], titles: string[]): Promise<ImageData[]> {
        console.log(files)
        const imageUrls = await Promise.all(
            files.map(file =>
                this._uploadImage.uploadImage(file)
            )
        );

        const images = imageUrls.map(
            (imageUrl, index) => ({
                title: titles[index],
                imageUrl
            })
        );

        return await this._imageRepository.addImages(
            userId,
            images
        );
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

    async getAllImages(userId: string, currentPage: number, limit: number): Promise<{ images: ImageData[]; total: number }> {
        return await this._imageRepository.getAllImages(userId, currentPage, limit);
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