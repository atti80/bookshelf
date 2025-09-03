"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signInSchema, signUpSchema, changePswdSchema } from "@/lib/schemas";
import { db } from "@/db/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  comparePasswords,
  generateRandomString,
  generateSalt,
  hashPassword,
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
import { getTranslations } from "./translation.actions";
import { cookies } from "next/headers";
// import { getOAuthClient } from "../core/oauth/base";

const translations = await getTranslations([
  "unable_login",
  "user_exists",
  "unable_register",
  "incorrect_password",
  "user_not_found",
  "unable_update_pswd",
  "old_password_incorrect",
  "new_password_same",
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
      return translations["unable_update_pswd"] || "Unable to update password";

    const user = await getUserFromSession(await cookies());
    if (user == null) return translations["user_not_found"] || "User not found";

    const userData = await db.query.User.findFirst({
      where: eq(User.id, user.id),
      columns: { salt: true, password: true },
    });

    if (userData == null || userData.password == null || userData.salt == null)
      return translations["user_not_found"] || "User not found";

    const isOldPasswordCorrect = await comparePasswords({
      password: data.oldPassword,
      hashedPassword: userData.password,
      salt: userData.salt,
    });
    if (!isOldPasswordCorrect)
      return translations["old_password_incorrect"] || "Old password incorrect";

    const newHashedPassword = await hashPassword(data.password, userData.salt);
    await db
      .update(User)
      .set({ password: newHashedPassword })
      .where(eq(User.id, user.id));
  } catch (error) {
    console.error("Error updating password:", error);
    return translations["unable_update_pswd"] || "Unable to update password";
  }

  await removeUserFromSession();
  redirect("/sign-in");
};

// export async function oAuthSignIn(provider: OAuthProvider) {
//   const oAuthClient = getOAuthClient(provider);
//   redirect(oAuthClient.createAuthUrl(await cookies()));
// }
