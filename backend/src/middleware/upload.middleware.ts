import multer from "multer";
import { Request } from "express";
import { ERROR_MESSAGES } from "../constants/error.messages.js";

const storage = multer.memoryStorage();

export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error(ERROR_MESSAGES.INVALID_FILE_FORMAT));
        }
    }
});