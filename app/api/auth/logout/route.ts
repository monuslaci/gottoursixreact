import { NextRequest, NextResponse } from "next/server";

import {
  buildExpiredSessionCookieOptions,
  deleteAuthSession,
  SESSION_COOKIE_NAME,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteAuthSession(token);
  }

  const response = NextResponse.json({
    authenticated: false,
  });

  response.cookies.set(buildExpiredSessionCookieOptions());

  return response;
}
