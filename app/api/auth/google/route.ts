import { NextRequest, NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import {
  buildAuthRedirect,
  buildGoogleAuthorizationUrl,
  createGoogleOAuthState,
  getGoogleOAuthOrigin,
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  sanitizeAuthNextPath,
} from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  const state = createGoogleOAuthState();
  const nextPath = sanitizeAuthNextPath(request.nextUrl.searchParams.get("next"));

  try {
    const authorizationUrl = buildGoogleAuthorizationUrl({
      origin: getGoogleOAuthOrigin(request.nextUrl.origin),
      state,
    });

    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set({
      name: GOOGLE_OAUTH_STATE_COOKIE,
      value: state,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 10 * 60,
    });
    response.cookies.set({
      name: GOOGLE_OAUTH_NEXT_COOKIE,
      value: nextPath,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 10 * 60,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof CommunityError
        ? error.message
        : "Google sign-in is not available right now.";

    return NextResponse.redirect(
      buildAuthRedirect(request.nextUrl.origin, nextPath, message)
    );
  }
}
