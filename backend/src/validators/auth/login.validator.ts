import { z } from 'zod'

export const loginSchema = z.object({
    body: z.object({
        email: z.string(),
        password: z.string("Password is required").min(1, "Password cannot be empty"),
    })
})

export type loginRequest=z.infer<typeof loginSchema>["body"]