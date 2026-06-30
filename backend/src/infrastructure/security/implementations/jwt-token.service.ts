import jwt from "jsonwebtoken";
import { ITokenService, JwtPayload } from "../interfaces/token-service.interface.js";
import { JwtConfig } from "../interfaces/jwt-config.interface.js";

export class JwtTokenService implements ITokenService {

    constructor(
        private readonly config: JwtConfig
    ) { }

    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.config.secret, {
            expiresIn: this.config.expiresIn
        });
    }

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(
            token,
            this.config.secret
        ) as JwtPayload;
    }
}