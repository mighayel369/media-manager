import { HydratedDocument } from "mongoose";
import { BaseRepository } from "../base/base.repository.js";
import { User, IUser } from "../../models/user.model.js";
import { IUserRepository } from "../interfaces/user-repository.interface.js";
import { IUserDTO, IUserLoginRecord, IRegisterPayload } from "../interfaces/user.interface.js";

type UserDocument = HydratedDocument<IUser>;

export class MongooseUserRepository extends BaseRepository<IUser, IUserDTO> implements IUserRepository {

    constructor() {
        super(User);
    }

    protected toDTO(user: UserDocument): IUserDTO {
        return {
            userId: user._id.toString(),
            name: user.name,
            email: user.email
        };
    }

    async createAccount(payload: IRegisterPayload): Promise<IUserDTO> {

        const user = await User.create({
            name: payload.name,
            email: payload.email,
            password: payload.password
        });

        return this.toDTO(user);
    }

    async findUserByEmail(
        email: string
    ): Promise<IUserDTO | null> {

        const user = await User.findOne({ email }).exec();

        if (!user) {
            return null;
        }

        return this.toDTO(user);
    }

    async findUserWithPassword(email: string): Promise<IUserLoginRecord | null> {

        const user = await User.findOne({ email }).select("+password").exec();

        if (!user) {
            return null;
        }

        return {
            ...this.toDTO(user),
            passwordHash: user.password
        };
    }

}