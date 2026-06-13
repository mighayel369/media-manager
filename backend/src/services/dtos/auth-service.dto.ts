import { IUserDTO } from "../../repositories/interfaces/user.interface.js";

export interface ILoginPayload {
    email: string;
    password: string;
}


export interface IAuthResponseDTO {
    user: IUserDTO;
    token: string;
}