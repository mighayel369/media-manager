import { ITokenService } from "../interfaces/token-service.interface.js";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/AppError.js";
import { HttpStatus } from "../../../constants/http_constants.js";
export class JwtTokenService implements ITokenService {
    private readonly secret: string;

    constructor() {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new AppError("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.secret = secret;
    }

    generateAccessToken(payload: Object): string {
        return jwt.sign(payload, this.secret, { expiresIn: '15m' });
    }


    verifyAccessToken(token: string): Object {
        return jwt.verify(token, this.secret)
    }
}