import { IImageService, IUpdateImagePayload } from "../interfaces/image-service.interface.js";
import { AppError } from "../../errors/AppError.js";
import { ImageDTO } from "../../repositories/interfaces/image.interface.js";
import { IImageRepository } from "../../repositories/interfaces/image-repository.interface.js";
import { IUploadImage } from "../../infrastructure/storage/interface/upload-image.interface.js";
import { HttpStatus } from "../../constants/http_constants.js";
import { IReorderItem } from "../../validators/image/reorder.image.validate.js";
import { ERROR_MESSAGES } from "../../constants/error.messages.js";

export class ImageService implements IImageService {
    constructor(
        private readonly _imageRepository: IImageRepository,
        private readonly _uploadImage: IUploadImage
    ) { }

    private async uploadImages(
        files: Express.Multer.File[]
    ): Promise<string[]> {
        return Promise.all(
            files.map(file => this._uploadImage.uploadImage(file))
        );
    }

    private buildImages(
        titles: string[],
        imageUrls: string[]
    ) {
        return imageUrls.map((imageUrl, index) => ({
            title: titles[index],
            imageUrl
        }));
    }

    async addImages(userId: string, files: Express.Multer.File[], titles: string[]): Promise<ImageDTO[]> {
        if (files.length !== titles.length) {
            throw new AppError(
                ERROR_MESSAGES.INVALID_IMAGE_DATA,
                HttpStatus.BAD_REQUEST
            );
        }
        const imageUrls = await this.uploadImages(files);

        const images = this.buildImages(
            titles,
            imageUrls
        );

        return this._imageRepository.addImages(userId, images);
    }

    async updateImage(imageId: string, updatePayload: IUpdateImagePayload): Promise<ImageDTO | null> {
        const { title, imageFile } = updatePayload;
        const updateFields: Partial<Omit<ImageDTO, "imageId">> = {};

        if (title) updateFields.title = title;

        if (imageFile) {
            const newImageUrl = await this._uploadImage.uploadImage(imageFile);
            updateFields.imageUrl = newImageUrl;
        }

        return this._imageRepository.updateImage(imageId, updateFields);
    }

    async removeImage(imageId: string): Promise<boolean> {
        return this._imageRepository.deleteImage(imageId);
    }

    async getAllImages(userId: string, currentPage: number, limit: number): Promise<{ images: ImageDTO[]; total: number }> {
        return this._imageRepository.getAllImages(userId, currentPage, limit);
    }

    async reorderImage(userId: string, reorderedItems: IReorderItem[]): Promise<void> {

        if (reorderedItems.length === 0) {
            throw new AppError(
                ERROR_MESSAGES.IMAGE_REORDER_DATA_REQUIRED,
                HttpStatus.BAD_REQUEST
            );
        }

        const positions = reorderedItems.map(item => item.position);

        if (new Set(positions).size !== positions.length) {
            throw new AppError(
                "Duplicate positions detected",
                HttpStatus.BAD_REQUEST
            );
        }

        const repositoryPayload = reorderedItems.map(item => ({
            imageId: item.imageId,
            position: item.position
        }));

        await this._imageRepository.updatePositions(
            userId,
            repositoryPayload
        );
    }
}