import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import logger from '../config/logger/index.js';
import { HttpStatus } from '../constants/http_constants.js';
import { ERROR_MESSAGES } from '../constants/error.messages.js';
import { LOG_MESSAGES } from '../constants/log.messages.js';
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        logger.warn(`[${req.method} ${req.originalUrl}] - ${err.message}`);

        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })

        return
    }

    logger.error(
        `${LOG_MESSAGES.UNCONTROLLED_CRASH} [${req.method} ${req.originalUrl}]`,
        err
    );

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
    return;
}