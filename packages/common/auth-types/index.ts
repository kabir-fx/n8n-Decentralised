import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long"),
    password: z.string().min(5, "Password must be at least 5 characters long").max(20, "Password must be at most 20 characters long")
})

export const signinSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long"),
    password: z.string().min(5, "Password must be at least 5 characters long").max(20, "Password must be at most 20 characters long")
})
