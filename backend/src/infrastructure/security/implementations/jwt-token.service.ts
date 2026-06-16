import { ITokenService } from "../interfaces/token-service.interface.js";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/AppError.js";
import { HttpStatus } from "../../../constants/http_constants.js";
import { ERROR_MESSAGES } from "../../../constants/error.messages.js";
import { JwtPayload } from "../interfaces/token-service.interface.js";
export class JwtTokenService implements ITokenService {
    private readonly secret: string;

    constructor() {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.secret = secret;
    }

    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: '15m' });
    }


    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, this.secret) as JwtPayload
    }
}