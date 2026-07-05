import { z } from "zod";

export const addImagesSchema = z.object({
    body: z.object({
        titles: z.preprocess(
            (value) => {
                if (Array.isArray(value)) return value;
                if (typeof value === "string") return [value];
                return value;
            },
            z.array(
                z.string().min(1, "Title cannot be empty")
            )
        )
    })
});