import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import logger from '../config/logger/index.js';
import { HttpStatus } from '../constants/http_constants.js';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        logger.warn(`[${req.method} ${req.originalUrl}] - ${err.message}`);

        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })

        return
    }

    logger.error(` Uncontrolled Crash on [${req.method} ${req.originalUrl}]:`, err);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error"
    });
    return;
}