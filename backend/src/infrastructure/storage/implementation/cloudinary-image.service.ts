import logger from "../../../config/logger/index.js";
import { IUploadImage } from "../interface/upload-image.interface.js";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../../../errors/AppError.js";
import { HttpStatus } from "../../../constants/http_constants.js";
import { LOG_MESSAGES } from "../../../constants/log.messages.js";
import { ERROR_MESSAGES } from "../../../constants/error.messages.js";

export class CloudinaryUploadImageService implements IUploadImage {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "media_hub_gallery",
                },
                (error, result) => {
                    if (error) {
                        logger.error(LOG_MESSAGES.CLOUDINARY_UPLOAD_FAILED, error);
                        return reject(new AppError(ERROR_MESSAGES.CLOUDINARY_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR));
                    }

                    if (!result) {
                        logger.error(LOG_MESSAGES.CLOUDINARY_EMPTY_RESPONSE, error);
                        return reject(new AppError(ERROR_MESSAGES.CLOUDINARY_EMPTY_RESPONSE, HttpStatus.INTERNAL_SERVER_ERROR));
                    }

                    resolve(result.secure_url);
                }
            );

            uploadStream.end(file.buffer);
        });
    }
}