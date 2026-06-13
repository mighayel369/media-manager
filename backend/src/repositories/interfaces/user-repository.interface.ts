import { IUserDTO, IRegisterPayload, IUserLoginRecord } from "./user.interface.js";

export interface IUserRepository {

    createAccount(payload: IRegisterPayload): Promise<IUserDTO>;

    findUserByEmail(email: string, includePassword?: boolean): Promise<IUserDTO | IUserLoginRecord | null>;
}