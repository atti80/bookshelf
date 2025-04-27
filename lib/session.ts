import { z } from "zod";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

// Seven days in seconds
export const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
  id: z.number(),
  isAdmin: z.boolean(),
  lastLogin: z.number(),
});

export type UserSession = z.infer<typeof sessionSchema>;

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  return getUserBySessionId(sessionId);
}

export async function updateUserSessionData(user: UserSession) {
  const sessionId = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await redis.set(`session:${sessionId}`, serializedUser, {
    ex: SESSION_EXPIRATION_SECONDS,
  });
}

export async function updateUserSessionExpiration(
  cookies: Pick<Cookies, "get" | "set">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserBySessionId(sessionId);
  if (user == null) return;

  const serializedUser = JSON.stringify(sessionSchema.parse(user));
  await redis.set(`session:${sessionId}`, serializedUser, {
    ex: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId);
}

export async function removeUserFromSession() {
  const _cookies = await cookies();
  const sessionId = _cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redis.del(`session:${sessionId}`);
  _cookies.delete(COOKIE_SESSION_KEY);
}

export async function setCookie(sessionId: string) {
  (await cookies()).set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

async function getUserBySessionId(sessionId: string) {
  const rawUser = await redis.get(`session:${sessionId}`);
  if (!rawUser) return null;

  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
}
