import { NextRequest, NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import {
  buildAuthRedirect,
  getGoogleOAuthOrigin,
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  sanitizeAuthNextPath,
  signInWithGoogleCode,
} from "@/lib/google-auth";
import {
  buildSessionCookieOptions,
  createAuthSession,
} from "@/lib/session";

function expireOAuthCookie(name: string) {
  return {
    name,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}

export async function GET(request: NextRequest) {
  const nextPath = sanitizeAuthNextPath(
    request.cookies.get(GOOGLE_OAUTH_NEXT_COOKIE)?.value
  );

  try {
    const expectedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
    const returnedState = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");
    const googleError = request.nextUrl.searchParams.get("error");

    if (googleError) {
      throw new CommunityError("Google sign-in was cancelled.", 400);
    }

    if (!expectedState || !returnedState || expectedState !== returnedState) {
      throw new CommunityError("Google sign-in session expired. Please try again.", 400);
    }

    if (!code) {
      throw new CommunityError("Google did not return an authorization code.", 400);
    }

    const userId = await signInWithGoogleCode({
      code,
      origin: getGoogleOAuthOrigin(request.nextUrl.origin),
    });
    const session = await createAuthSession(userId);
    const response = NextResponse.redirect(
      buildAuthRedirect(request.nextUrl.origin, nextPath)
    );

    response.cookies.set(buildSessionCookieOptions(session.token, session.expires));
    response.cookies.set(expireOAuthCookie(GOOGLE_OAUTH_STATE_COOKIE));
    response.cookies.set(expireOAuthCookie(GOOGLE_OAUTH_NEXT_COOKIE));

    return response;
  } catch (error) {
    const message =
      error instanceof CommunityError
        ? error.message
        : "Unable to complete Google sign-in.";
    const response = NextResponse.redirect(
      buildAuthRedirect(request.nextUrl.origin, nextPath, message)
    );

    response.cookies.set(expireOAuthCookie(GOOGLE_OAUTH_STATE_COOKIE));
    response.cookies.set(expireOAuthCookie(GOOGLE_OAUTH_NEXT_COOKIE));

    return response;
  }
}
