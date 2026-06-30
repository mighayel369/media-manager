import express from 'express';
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/implementation.ts/auth.service.js";
import { MongooseUserRepository } from "../repositories/implementations/user.repository.impl.js";
import { BcryptPasswordService } from "../infrastructure/security/implementations/bcrypt-password.service.js";
import { JwtTokenService } from "../infrastructure/security/implementations/jwt-token.service.js";
import { validateRequest } from '../middleware/validate.request.middleware.js';
import { registerSchema } from '../validators/auth/register.validator.js';
import { loginSchema } from '../validators/auth/login.validator.js';
import { jwtConfig } from '../config/config.env.js';


const router = express.Router();

const passwordService = new BcryptPasswordService();
const userRepo = new MongooseUserRepository();
const tokenService = new JwtTokenService(jwtConfig);
const authService = new AuthService(userRepo, passwordService, tokenService);
const authController = new AuthController(authService);

router.post("/register", validateRequest(registerSchema), authController.registerAccount);


router.post("/login", validateRequest(loginSchema), authController.loginAccount);

export default router;