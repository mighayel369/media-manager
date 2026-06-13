import { IRegisterPayload, IUserDTO } from "../../repositories/interfaces/user.interface.js";
import { ILoginPayload, IAuthResponseDTO } from "../dtos/auth-service.dto.js";
import { IAuthService } from "../interfaces/auth-service.interface.js";
import { AppError } from "../../errors/AppError.js";
import { ITokenService } from "../../infrastructure/security/interfaces/token-service.interface.js";
import { IPasswordService } from "../../infrastructure/security/interfaces/password-service.interface.js";
import { IUserRepository } from "../../repositories/interfaces/user-repository.interface.js";
import { HttpStatus } from "../../constants/http_constants.js";

export class AuthService implements IAuthService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ) { }

    async login(payload: ILoginPayload): Promise<IAuthResponseDTO> {
        const { email, password } = payload;


        const userRecord = await this._userRepository.findUserByEmail(email, true);

        if (!userRecord || !('passwordHash' in userRecord)) {
            throw new AppError("Invalid email or password", HttpStatus.BAD_REQUEST);
        }

        const isPasswordValid = await this._passwordService.compare(password, userRecord.passwordHash);
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", HttpStatus.BAD_REQUEST);
        }

        const token = this._tokenService.generateAccessToken({
            userId: userRecord.userId,
            email: userRecord.email
        });

        const cleanUser: IUserDTO = {
            userId: userRecord.userId,
            name: userRecord.name,
            email: userRecord.email
        };

        return {
            user: cleanUser,
            token: token
        };
    }

    async register(payload: IRegisterPayload): Promise<IUserDTO> {
        const { password, name, email } = payload;

        const existingUser = await this._userRepository.findUserByEmail(email);

        if (existingUser) {
            throw new AppError("An account with this email already exists", HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await this._passwordService.hash(password);

        const newUser = await this._userRepository.createAccount({
            name,
            email,
            password: hashedPassword,
        });

        return newUser;
    }
}