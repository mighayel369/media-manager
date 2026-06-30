import { ZodType } from "zod";
import { HttpStatus } from "../constants/http_constants.js";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger/index.js";
import { LOG_MESSAGES } from "../constants/log.messages.js";
import { ERROR_MESSAGES } from "../constants/error.messages.js";

type RequestSchema = ZodType<{
    body?: unknown;
    query?: unknown;
    params?: unknown;
}>;

export const validateRequest = (schema: RequestSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validatedData = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (!validatedData.success) {
                const errorMessages = validatedData.error.issues.map(issue => issue.message);

                logger.debug(LOG_MESSAGES.VALIDATION_ERROR, { errors: errorMessages });

                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: errorMessages[0] || ERROR_MESSAGES.VALIDATION_FAILED
                });
                return;
            }

            for (const key of Object.keys(validatedData.data)) {
                const location = key as keyof typeof validatedData.data;

                if (validatedData.data[location] !== undefined) {
                    Object.defineProperty(req, location, {
                        value: validatedData.data[location],
                        writable: true,
                        configurable: true,
                        enumerable: true
                    });
                }
            }

            next();

        } catch (err) {
            next(err);
        }
    };
};