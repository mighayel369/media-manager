import z from 'zod';

export const updateImageSchema = z.object({
    body: z.object({
        title: z.string().optional()
    })
});

export type updateImageRequest = z.infer<typeof updateImageSchema>['body'];