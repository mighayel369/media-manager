import { v2 as cloudinary } from "cloudinary";
import logger from "../../../config/logger/index.js";
import { IUploadImage } from "../interface/upload-image.interface.js";
import { CloudinaryConfig } from "../interface/cloudinary-config.interface.js";
import { AppError } from "../../../errors/AppError.js";
import { HttpStatus } from "../../../constants/http_constants.js";
import { ERROR_MESSAGES } from "../../../constants/error.messages.js";
import { LOG_MESSAGES } from "../../../constants/log.messages.js";

export class CloudinaryUploadImageService
    implements IUploadImage {

    constructor(
        private readonly config: CloudinaryConfig
    ) {
        cloudinary.config({
            cloud_name: config.cloudName,
            api_key: config.apiKey,
            api_secret: config.apiSecret
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {

        return new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: this.config.folder
                },
                (error, result) => {

                    if (error) {
                        logger.error(
                            LOG_MESSAGES.CLOUDINARY_UPLOAD_FAILED,
                            error
                        );

                        return reject(
                            new AppError(
                                ERROR_MESSAGES.CLOUDINARY_UPLOAD_FAILED,
                                HttpStatus.INTERNAL_SERVER_ERROR
                            )
                        );
                    }

                    if (!result) {
                        logger.error(
                            LOG_MESSAGES.CLOUDINARY_EMPTY_RESPONSE
                        );

                        return reject(
                            new AppError(
                                ERROR_MESSAGES.CLOUDINARY_EMPTY_RESPONSE,
                                HttpStatus.INTERNAL_SERVER_ERROR
                            )
                        );
                    }

                    resolve(result.secure_url);
                }
            );

            uploadStream.end(file.buffer);
        });
    }
}