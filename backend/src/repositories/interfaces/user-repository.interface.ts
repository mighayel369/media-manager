import { IUserDTO, IUserLoginRecord, IRegisterPayload } from "./user.interface.js";

export interface IUserRepository {
    createAccount(payload: IRegisterPayload): Promise<IUserDTO>;
    findUserByEmail(email: String): Promise<IUserDTO | null>;
    findUserWithPassword(email: string): Promise<IUserLoginRecord | null>;
}