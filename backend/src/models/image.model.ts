import { Schema, model, Types } from "mongoose";

export interface IImage {
    userId: Types.ObjectId;
    title: string;
    imageUrl: string;
    position: number;
}

const imageSchema = new Schema<IImage>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        position: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Image = model<IImage>("Image", imageSchema);