import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string("Name is required").min(2, "Name must be at least 2 characters long").trim(),
        email: z.email("Invalid email format").lowercase().trim(),
        password: z.string("Password is required").min(8, "Password must be at least 8 characters long"),
    })
});

export type RegisterRequest = z.infer<typeof registerSchema>["body"]