import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import logger from "../config/logger/index.js";
import { HttpStatus } from "../constants/http_constants.js";
import { AUTH_MESSAGES } from "../constants/success.messages.js";
import { LOG_MESSAGES } from "../constants/log.messages.js";


export const authMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.UNAUTHORIZED});
            return;
        }

        try {
            const secret = process.env.JWT_SECRET as string;

            const decode = jwt.verify(token, secret) as unknown as { userId: string; email: string };

            req.user = {
                userId: decode.userId,
                email: decode.email,
            };

            next();
        } catch (err) {
            logger.warn(LOG_MESSAGES.TOKEN_VERIFICATION_FAILED, err instanceof Error ? err.message : "Unknown");
            res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "unauthorized user" });
        }
    };
};