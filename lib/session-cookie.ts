// Edge-safe helper for middleware
import type { NextRequest } from "next/server";

const COOKIE_SESSION_KEY = "session-id";

export function getSessionIdFromRequest(request: NextRequest): string | null {
    return request.cookies.get(COOKIE_SESSION_KEY)?.value ?? null;
}
