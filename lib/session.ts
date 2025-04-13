import { z } from "zod";
import crypto from "crypto";
import { client as redisClient } from "@/lib/redis";
import { cookies } from "next/headers";

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
  id: z.number(),
  isAdmin: z.boolean(),
});

type UserSession = z.infer<typeof sessionSchema>;

export async function getUserFromSession() {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  return getUserBySessionId(sessionId);
}

export async function updateUserSessionData(user: UserSession) {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await redisClient.set(`session:${sessionId}`, serializedUser, {
    EX: SESSION_EXPIRATION_SECONDS,
  });
}

export async function createUserSession(user: UserSession) {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await redisClient.set(`session:${sessionId}`, serializedUser, {
    EX: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId);
}

export async function updateUserSessionExpiration() {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserBySessionId(sessionId);
  if (user == null) return;

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await redisClient.set(`session:${sessionId}`, serializedUser, {
    EX: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId);
}

export async function removeUserFromSession() {
  const _cookies = await cookies();
  const sessionId = _cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redisClient.del(`session:${sessionId}`);
  _cookies.delete(COOKIE_SESSION_KEY);
}

async function setCookie(sessionId: string) {
  (await cookies()).set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

async function getUserBySessionId(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);
  if (!rawUser) return null;

  const { success, data: user } = sessionSchema.safeParse(JSON.parse(rawUser));

  return success ? user : null;
}
