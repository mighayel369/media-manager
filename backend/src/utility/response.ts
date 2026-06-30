
import { Response } from "express";

export class ResponseHandler {
    static success(res: Response, status: number, payload: {
        message?: string; data?: unknown;[key: string]: unknown;
    }) {
        return res.status(status).json({
            success: true,
            ...payload
        });
    }

    static successWithoutData(res: Response, status: number, message: string) {
        return res.status(status).json({
            success: true,
            message
        });
    }
}