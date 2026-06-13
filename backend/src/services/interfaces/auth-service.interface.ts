
import { IRegisterPayload, IUserDTO } from "../../repositories/interfaces/user.interface.js";
import { ILoginPayload,IAuthResponseDTO } from "../dtos/auth-service.dto.js";

export interface IAuthService {
  register(payload: IRegisterPayload): Promise<IUserDTO>;
  login(payload: ILoginPayload): Promise<IAuthResponseDTO>;
}