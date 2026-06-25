import z from "zod";

export const addImagesSchema = z.object({
    body: z.object({
        titles: z.array(
            z.string().min(1, "Title cannot be empty")
        )
    })
});

export type addImageBody = z.infer<typeof addImagesSchema>['body'];