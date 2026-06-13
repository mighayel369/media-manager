
export interface IUserDTO {
    userId: string;
    name: string;
    email: string;
}

export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface IUserLoginRecord extends IUserDTO {
    passwordHash: string;
}