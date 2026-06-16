import z from 'zod';

export const reorderImageSchema = z.object({
    body: z.object({
        reorderedItems: z.array(
            z.object({
                imageId: z.string("imageId is required for reordering"),
                position: z.number("position index is required").int().nonnegative()
            })
        ).min(1, "Reordered list cannot be empty")
    })
});

export type reorderImageRequest = z.infer<typeof reorderImageSchema>['body'];


export type IReorderItem = reorderImageRequest['reorderedItems'][number];