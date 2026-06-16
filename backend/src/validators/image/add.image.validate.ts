import z from 'zod';

export const addImageSchema = z.object({
    body: z.object({
        title: z.string("Title is required").min(1, "Title cannot be empty"),
    })
});

export type addImageBody = z.infer<typeof addImageSchema>['body'];