export interface JwtPayload {
    userId: string;
    email: string;
}
export interface ITokenService {
    generateAccessToken(payload: JwtPayload): string;
    verifyAccessToken(token: string): JwtPayload;
}