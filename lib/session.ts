import { z } from "zod";
import crypto from "crypto";
import { client } from "@/lib/redis";
import { cookies } from "next/headers";

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
  id: z.number(),
  isAdmin: z.boolean(),
});

type UserSession = z.infer<typeof sessionSchema>;
// export type Cookies = {
//   set: (
//     key: string,
//     value: string,
//     options: {
//       secure?: boolean;
//       httpOnly?: boolean;
//       sameSite?: "strict" | "lax";
//       expires?: number;
//     }
//   ) => void;
//   get: (key: string) => { name: string; value: string } | undefined;
//   delete: (key: string) => void;
// };

export async function getUserFromSession() {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function updateUserSessionData(user: UserSession) {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await client.set(`session:${sessionId}`, serializedUser, {
    EX: SESSION_EXPIRATION_SECONDS,
  });
}

export async function createUserSession(user: UserSession) {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await client.set(`session:${sessionId}`, serializedUser, {
    EX: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId);
}

export async function updateUserSessionExpiration() {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserSessionById(sessionId);
  if (user == null) return;

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await client.set(`session:${sessionId}`, serializedUser, {
    EX: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId);
}

export async function removeUserFromSession() {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await client.del(`session:${sessionId}`);
  (await cookies()).delete(COOKIE_SESSION_KEY);
}

async function setCookie(sessionId: string) {
  (await cookies()).set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

async function getUserSessionById(sessionId: string) {
  const rawUser = await client.get(`session:${sessionId}`);

  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
}
