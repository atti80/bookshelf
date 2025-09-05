import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createSignInSchema = (translations: Record<string, string>) =>
  z.object({
    email: z
      .string()
      .email(translations["invalid_email"] || "Invalid email address"),
    password: z
      .string()
      .min(1, translations["password_required"] || "Password is required"),
  });

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createSignUpSchema = (translations: Record<string, string>) =>
  z.object({
    name: z
      .string()
      .min(1, translations["name_required"] || "Name is required"),
    email: z
      .string()
      .email(translations["invalid_email"] || "Invalid email address"),
    password: z
      .string()
      .min(
        8,
        translations["password_short"] ||
          "Password must be at least 8 characters"
      ),
  });

export const changePswdSchema = z
  .object({
    oldPassword: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    token: z.string(),
  })
  .refine((data) => data.token || data.oldPassword.length > 0, {
    message: "Old password is required",
    path: ["oldPassword"],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: "New password is same as old",
    path: ["password"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createChangePswdSchema = (translations: Record<string, string>) =>
  z
    .object({
      oldPassword: z.string(),
      password: z
        .string()
        .min(
          8,
          translations["password_short"] ||
            "Password must be at least 8 characters"
        ),
      confirmPassword: z
        .string()
        .min(
          8,
          translations["password_short"] ||
            "Password must be at least 8 characters"
        ),
      token: z.string(),
    })
    .refine((data) => data.token || data.oldPassword.length > 0, {
      message:
        translations["old_password_required"] || "Old password is required",
      path: ["oldPassword"],
    })
    .refine((data) => data.oldPassword !== data.password, {
      message:
        translations["new_password_same"] || "New password is same as old",
      path: ["password"],
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: translations["passwords_dont_match"] || "Passwords don't match",
      path: ["confirmPassword"],
    });

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const createResetPasswordSchema = (
  translations: Record<string, string>
) =>
  z.object({
    email: z
      .string()
      .email(translations["invalid_email"] || "Invalid email address"),
  });

export type SignInSchema = z.infer<ReturnType<typeof createSignInSchema>>;
export type SignUpSchema = z.infer<ReturnType<typeof createSignUpSchema>>;
export type ChangePswdSchema = z.infer<
  ReturnType<typeof createChangePswdSchema>
>;
export type ResetPasswordSchema = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
