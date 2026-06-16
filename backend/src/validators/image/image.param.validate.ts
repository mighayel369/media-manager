import z from 'zod';

export const imageSchema = z.object({
    params: z.object({
        imageId: z.string( "Image ID parameter path is required").min(1)
    })
});

export type imageParams = z.infer<typeof imageSchema>['params'];