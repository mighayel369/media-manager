import { Request, Response, NextFunction } from "express";
import { IImageService } from "../services/interfaces/image-service.interface.js";
import { HttpStatus } from "../constants/http_constants.js";
import { AppError } from "../errors/AppError.js";
import { reorderImageRequest } from "../validators/image/reorder.image.validate.js";
import { imageParams } from "../validators/image/image.param.validate.js";
import { ERROR_MESSAGES } from "../constants/error.messages.js";
import { IMAGE_MESSAGES } from "../constants/success.messages.js";

export class ImageController {
    constructor(private readonly _imageService: IImageService) { }

    createImageGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId as string;

            const files = req.files as Express.Multer.File[];

            const titles = Array.isArray(req.body.titles)
                ? req.body.titles
                : [req.body.titles];

            if (!files.length) {
                throw new AppError(
                    ERROR_MESSAGES.IMAGE_NOT_FOUND,
                    HttpStatus.BAD_REQUEST
                );
            }

            const newImages =
                await this._imageService.addImages(
                    userId,
                    files,
                    titles
                );

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: IMAGE_MESSAGES.UPLOADED,
                data: newImages
            });
        } catch (error) {
            next(error);
        }
    };

    updateImageGallery = async (req: Request<imageParams>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { imageId } = req.params
            const imagePayload = req.body;
            const imageFile = req.file;

            const updatedImage = await this._imageService.updateImage(imageId, {
                ...imagePayload,
                imageFile,

            });

            if (!updatedImage) {
                throw new AppError(ERROR_MESSAGES.IMAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: IMAGE_MESSAGES.UPDATED,
                data: updatedImage
            });
        } catch (error) {
            next(error);
        }
    };

    getAllImages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId as string;
            const currentPage = Number(req.query.currentPage ?? 1);
            const limit = Number(req.query.limit ?? 8);
            console.log(req.query)
            const result = await this._imageService.getAllImages(
                userId,
                currentPage,
                limit
            );

            const hasMore = currentPage * limit < result.total;

            res.status(HttpStatus.OK).json({
                success: true,
                data: result.images,
                total: result.total,
                currentPage,
                limit,
                hasMore
            });
        } catch (error) {
            next(error);
        }
    };

    deleteImage = async (req: Request<imageParams>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { imageId } = req.params

            if (!imageId) {
                throw new AppError(ERROR_MESSAGES.IMAGE_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const isDeleted = await this._imageService.removeImage(imageId);

            if (!isDeleted) {
                throw new AppError(ERROR_MESSAGES.IMAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: IMAGE_MESSAGES.DELETED
            });
        } catch (error) {
            next(error);
        }
    };

    reorderImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { reorderedItems } = req.body as reorderImageRequest;

            await this._imageService.reorderImage(reorderedItems);

            res.status(HttpStatus.OK).json({
                success: true,
                message: IMAGE_MESSAGES.REORDERED
            });
        } catch (error) {
            next(error);
        }
    };
}