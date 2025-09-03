import { getTranslations } from "@/actions/translation.actions";
import { z } from "zod";

const translations = await getTranslations([
  "invalid_email",
  "password_required",
  "name_required",
  "password_short",
]);

export const signInSchema = z.object({
  email: z
    .string()
    .email(translations["invalid_email"] || "Invalid email address"),
  password: z
    .string()
    .min(1, translations["password_required"] || "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, translations["name_required"] || "Name is required"),
  email: z
    .string()
    .email(translations["invalid_email"] || "Invalid email address"),
  password: z
    .string()
    .min(
      8,
      translations["password_short"] || "Password must be at least 8 characters"
    ),
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
