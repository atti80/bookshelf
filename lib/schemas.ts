import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const articleSchema = z.object({
  genres: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .min(1, "Select at least one genre")
    .max(5, "Select at most 5 genres"),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(40, { message: "Title cannot be more than 40 characters" }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters" }),
  image: z.string().optional(),
});
