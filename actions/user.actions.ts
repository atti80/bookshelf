import { getUserFromSession } from "@/lib/session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { User } from "@/db/schema";
import { cookies } from "next/headers";

export type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>;

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies());

  if (user == null) {
    if (redirectIfNotFound) return redirect("/sign-in");
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.id);

    if (fullUser == null) throw new Error("User not found in database");
    fullUser.lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

function getUserFromDb(id: number) {
  return db.query.User.findFirst({
    columns: {
      id: true,
      email: true,
      isAdmin: true,
      name: true,
      lastLogin: true,
    },
    with: {
      likes: {
        columns: { articleId: true },
      },
      comments: {
        columns: { id: true },
      },
    },
    where: eq(User.id, id),
  });
}

export const updateLastLogin = async (id: number) => {
  try {
    await db.update(User).set({ lastLogin: new Date() }).where(eq(User.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error updating last login:", error);
    return { success: false, error: "Failed to update last login" };
  }
};
