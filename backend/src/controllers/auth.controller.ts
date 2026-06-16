import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../services/interfaces/auth-service.interface.js";
import { RegisterRequest } from "../validators/auth/register.validator.js";
import { loginRequest } from "../validators/auth/login.validator.js";
import { HttpStatus } from "../constants/http_constants.js";
import { AUTH_MESSAGES } from "../constants/success.messages.js";
export class AuthController {
    constructor(private readonly _authService: IAuthService) { }

    registerAccount = async (req: Request<unknown, unknown, RegisterRequest>, res: Response, next: NextFunction) => {
        try {
            const { email, password, name } = req.body

            const result = await this._authService.register({
                email,
                password,
                name
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: AUTH_MESSAGES.ACCOUNT_CREATED,
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    loginAccount = async (req: Request<unknown, unknown, loginRequest>, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const result = await this._authService.login({ email, password });

            res.status(HttpStatus.OK).json({
                success: true,
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}