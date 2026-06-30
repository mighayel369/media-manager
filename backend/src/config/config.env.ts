import { AppError } from "../errors/AppError.js";
import { HttpStatus } from "../constants/http_constants.js";
import { JwtConfig } from "../infrastructure/security/interfaces/jwt-config.interface.js";
import { CloudinaryConfig } from "../infrastructure/storage/interface/cloudinary-config.interface.js";
function required(value: string | undefined, name: string): string {
    if (!value) {
        throw new AppError(
            `${name} is missing`,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    return value;
}

export const jwtConfig: JwtConfig = {
    secret: required(process.env.JWT_SECRET, "JWT_SECRET"),
    expiresIn: "15m"
};

export const cloudinaryConfig: CloudinaryConfig = {
    cloudName: required(
        process.env.CLOUDINARY_CLOUD_NAME,
        "CLOUDINARY_CLOUD_NAME"
    ),
    apiKey: required(
        process.env.CLOUDINARY_API_KEY,
        "CLOUDINARY_API_KEY"
    ),
    apiSecret: required(
        process.env.CLOUDINARY_API_SECRET,
        "CLOUDINARY_API_SECRET"
    ),
    folder: "media_hub_gallery"
};