import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../services/interfaces/auth-service.interface.js";
import { RegisterRequest } from "../validators/auth/register.validator.js";
import { loginRequest } from "../validators/auth/login.validator.js";
import { HttpStatus } from "../constants/http_constants.js";
import { AUTH_MESSAGES } from "../constants/success.messages.js";
import { ResponseHandler } from "../utility/response.js";
export class AuthController {
    constructor(private readonly _authService: IAuthService) { }

    registerAccount = async (req: Request<unknown, unknown, RegisterRequest>, res: Response, next: NextFunction) => {
        try {
            const result = await this._authService.register(req.body);

            ResponseHandler.success(
                res,
                HttpStatus.CREATED,
                {
                    message: AUTH_MESSAGES.ACCOUNT_CREATED,
                    ...result
                }
            );

        } catch (error) {
            next(error);
        }
    }

    loginAccount = async (req: Request<unknown, unknown, loginRequest>, res: Response, next: NextFunction) => {
        try {
            const result = await this._authService.login(req.body);

            ResponseHandler.success(res, HttpStatus.OK, {
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}