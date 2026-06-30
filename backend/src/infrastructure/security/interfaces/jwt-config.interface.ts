import { SignOptions } from "jsonwebtoken";

export interface JwtConfig {
    secret: string;
    expiresIn: SignOptions["expiresIn"];
}