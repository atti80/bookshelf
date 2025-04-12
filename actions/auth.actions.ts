"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "@/lib/schemas";
import { db } from "@/db/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "@/lib/passwordHasher";
import { cookies } from "next/headers";
import { createUserSession, removeUserFromSession } from "@/lib/session";
// import { getOAuthClient } from "../core/oauth/base";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Unable to log you in";

  const user = await db.query.User.findFirst({
    columns: {
      password: true,
      salt: true,
      id: true,
      email: true,
      isAdmin: true,
    },
    where: eq(User.email, data.email),
  });

  if (user == null || user.password == null || user.salt == null) {
    return "Unable to log you in";
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log you in";

  await createUserSession({ id: user.id, isAdmin: user.isAdmin ?? false });

  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Unable to create account: parse error";

  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, data.email),
  });

  if (existingUser != null) return "Account already exists for this email";

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
      })
      .returning({ id: User.id, isAdmin: User.isAdmin });

    if (user == null) return "Unable to create account";

    console.log(`user: ${user.id}, isAdmin: ${user.isAdmin}`);

    await createUserSession({ id: user.id, isAdmin: user.isAdmin ?? false });
  } catch (e) {
    console.log(e);
    return `Unable to create account: ${e}`;
  }

  redirect("/");
}

export async function logOut() {
  await removeUserFromSession();
  redirect("/");
}

// export async function oAuthSignIn(provider: OAuthProvider) {
//   const oAuthClient = getOAuthClient(provider);
//   redirect(oAuthClient.createAuthUrl(await cookies()));
// }
