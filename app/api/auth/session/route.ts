import { NextRequest, NextResponse } from "next/server";

import {
  buildSessionCookieOptions,
  getCurrentSessionUserFromRequest,
  refreshAuthSession,
  SESSION_COOKIE_NAME,
} from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getCurrentSessionUserFromRequest(request);
  const response = NextResponse.json({
    authenticated: Boolean(user),
    user,
  });

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (user && token) {
    const session = await refreshAuthSession(token);
    response.cookies.set(buildSessionCookieOptions(session.token, session.expires));
  }

  return response;
}
