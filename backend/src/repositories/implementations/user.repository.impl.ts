
import { User, IUser } from "../../models/user.model.js";
import { IUserRepository } from "../interfaces/user-repository.interface.js";
import { IUserDTO, IRegisterPayload, IUserLoginRecord } from "../interfaces/user.interface.js";

export class mongooseUserRepository implements IUserRepository {

    async createAccount(payload: IRegisterPayload): Promise<IUserDTO> {
        console.log(payload)
        const rawUser: IUser = await User.create({
            name: payload.name,
            email: payload.email,
            password: payload.password,
        });

        return {
            userId: rawUser._id.toString(),
            name: rawUser.name,
            email: rawUser.email,
        };
    }

    async findUserByEmail(email: string, includePassword = false): Promise<IUserDTO | IUserLoginRecord | null> {
        let query = User.findOne({ email });

        if (includePassword) {
            query = query.select("+password");
        }

        const rawUser = await query;
        if (!rawUser) return null;

        const baseUser: IUserDTO = {
            userId: rawUser._id.toString(),
            name: rawUser.name,
            email: rawUser.email
        };

        if (includePassword) {
            return {
                ...baseUser,
                passwordHash: rawUser.password
            }
        }

        return baseUser;
    }
}