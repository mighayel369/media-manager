import { Schema, model, Document } from "mongoose";



export interface IUser extends Document {
    name: string
    email: string
    password: string
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value: string) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Please provide a valid email address"
            }
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false
        }
    },
    {
        timestamps: true,
    }
)

export const User = model("User", userSchema);