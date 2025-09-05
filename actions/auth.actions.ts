"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import {
  signInSchema,
  signUpSchema,
  changePswdSchema,
  resetPasswordSchema,
} from "@/lib/schemas";
import { db } from "@/db/db";
import { PasswordRequests, User } from "@/db/schema";
import { and, eq, gt, isNull } from "drizzle-orm";
import {
  comparePasswords,
  generateRandomString,
  generateSalt,
  generateToken,
  hashPassword,
  hashToken,
} from "@/lib/passwordHasher";
import {
  getUserFromSession,
  removeUserFromSession,
  SESSION_EXPIRATION_SECONDS,
  setCookie,
  UserSession,
} from "@/lib/session";
import { redis } from "@/lib/redis";
import { updateLastLogin } from "./user.actions";
import { cookies } from "next/headers";
import { getCachedTranslations } from "./translation.helper";

const translations = await getCachedTranslations([
  "unable_login",
  "user_exists",
  "unable_register",
  "incorrect_password",
  "user_not_found",
  "unable_update_pswd",
  "old_password_incorrect",
  "new_password_same",
  "email_not_registered",
  "unable_request_reset",
  "reset_link_invalid",
  "password_reset",
]);

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return translations["unable_login"] || "Unable to log you in";

  const user = await db.query.User.findFirst({
    columns: {
      id: true,
      email: true,
      password: true,
      salt: true,
      isAdmin: true,
      lastLogin: true,
    },
    where: eq(User.email, data.email),
  });

  if (user == null || user.password == null || user.salt == null) {
    return translations["user_not_found"] || "User not found";
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword)
    return translations["incorrect_password"] || "Incorrect password";

  await updateLastLogin(user.id);
  await createUserSession({
    id: user.id,
    isAdmin: user.isAdmin ?? false,
    lastLogin: user.lastLogin ? user.lastLogin.getTime() : 0,
  });

  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success)
    return translations["unable_register"] || "Unable to create account";

  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, data.email),
  });

  if (existingUser != null)
    return (
      translations["user_exists"] || "Account already exists for this email"
    );

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const [user] = await db
      .insert(User)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
        lastLogin: new Date(),
      })
      .returning({ id: User.id, isAdmin: User.isAdmin });

    if (user == null)
      return translations["unable_register"] || "Unable to create account";

    await createUserSession({
      id: user.id,
      isAdmin: user.isAdmin ?? false,
      lastLogin: 0,
    });
  } catch (e) {
    console.log(e);
    return `${translations["unable_register"]} ${e}`;
  }

  redirect("/");
}

export async function logOut() {
  await removeUserFromSession();
  redirect("/");
}

async function createUserSession(user: UserSession) {
  const sessionId = generateRandomString(512);

  await redis.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId);
}

export const updatePassword = async (
  unsafeData: z.infer<typeof changePswdSchema>
) => {
  try {
    const { success, data } = changePswdSchema.safeParse(unsafeData);

    if (!success)
      return {
        success: false,
        error:
          translations["unable_update_pswd"] || "Unable to update password",
      };

    if (!data.token && !data.oldPassword)
      return {
        success: false,
        error:
          translations["unable_update_pswd"] || "Unable to update password",
      };

    let userId = null;

    if (!data.token) {
      const user = await getUserFromSession(await cookies());
      userId = user?.id;
    } else {
      // find password request with token and get userID
      const hashedToken = hashToken(data.token);
      const pswdRequest = await db.query.PasswordRequests.findFirst({
        where: and(
          eq(PasswordRequests.token, hashedToken),
          isNull(PasswordRequests.usedAt),
          gt(PasswordRequests.expiresAt, new Date())
        ),
      });

      if (pswdRequest == null)
        return {
          success: false,
          error: translations["reset_link_invalid"],
        };

      // Mark request as used
      await db
        .update(PasswordRequests)
        .set({ usedAt: new Date() })
        .where(eq(PasswordRequests.id, pswdRequest.id));

      userId = pswdRequest.userId;
    }

    if (userId == null)
      return {
        success: false,
        error: translations["user_not_found"] || "User not found",
      };

    // Find user in database
    const userData = await db.query.User.findFirst({
      where: eq(User.id, userId),
      columns: { salt: true, password: true },
    });

    if (userData == null || userData.password == null || userData.salt == null)
      return {
        success: false,
        error: translations["user_not_found"] || "User not found",
      };

    // Check if current password is correct
    if (data.oldPassword) {
      const isOldPasswordCorrect = await comparePasswords({
        password: data.oldPassword,
        hashedPassword: userData.password,
        salt: userData.salt,
      });
      if (!isOldPasswordCorrect)
        return {
          success: false,
          error:
            translations["old_password_incorrect"] || "Old password incorrect",
        };
    }

    // Update password
    const newHashedPassword = await hashPassword(data.password, userData.salt);
    await db
      .update(User)
      .set({ password: newHashedPassword })
      .where(eq(User.id, userId));

    await removeUserFromSession();
    return {
      success: true,
      message:
        translations["password_reset"] ||
        "Your password has been reset. You will be redirected to the login page.",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: translations["unable_update_pswd"] || "Unable to update password",
    };
  }
};

export const insertPasswordRequest = async (
  unsafeData: z.infer<typeof resetPasswordSchema>
) => {
  try {
    const { success, data } = resetPasswordSchema.safeParse(unsafeData);
    if (!success)
      return {
        success: false,
        error:
          translations["unable_request_reset"] || "Unable to request reset",
      };

    const user = await db.query.User.findFirst({
      where: eq(User.email, data.email),
      columns: { id: true, salt: true },
    });
    if (user == null)
      return {
        success: false,
        error: translations["email_not_registered"] || "Email not registered",
      };

    const token = generateToken();
    const hashedToken = await hashToken(token);
    const expiration = new Date(Date.now() + 3600 * 1000);

    await db
      .delete(PasswordRequests)
      .where(eq(PasswordRequests.userId, user.id));

    await db.insert(PasswordRequests).values({
      userId: user.id,
      token: hashedToken,
      expiresAt: expiration,
    });

    return { success: true, token };
  } catch (error) {
    console.error("Error inserting password request:", error);
    throw { success: false, error };
  }
};
