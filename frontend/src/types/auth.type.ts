export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
    confirm: string;
}

export type IRegisterRequest = Omit<IRegisterPayload, "confirm">;

export interface ILoginPayload {
    email: string
    password: string
}