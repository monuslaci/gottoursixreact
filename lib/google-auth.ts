import { randomBytes } from "node:crypto";

import { getDefaultAvatarPath } from "@/lib/avatars";
import { CommunityError } from "@/lib/community";
import { prisma } from "@/lib/prisma";
import { generateUniqueUsername } from "@/lib/profile";

export const GOOGLE_OAUTH_STATE_COOKIE = "six_google_oauth_state";
export const GOOGLE_OAUTH_NEXT_COOKIE = "six_google_oauth_next";

const GOOGLE_AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  id_token?: string;
  scope?: string;
  token_type?: string;
  refresh_token?: string;
};

type GoogleUserInfo = {
  sub?: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
};

function readRequiredEnv(name: "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new CommunityError(`${name} is not configured.`, 503);
  }

  return value;
}

export function createGoogleOAuthState() {
  return randomBytes(24).toString("hex");
}

export function getGoogleRedirectUri(origin: string) {
  return new URL("/api/auth/google/callback", origin).toString();
}

export function buildGoogleAuthorizationUrl({
  origin,
  state,
}: {
  origin: string;
  state: string;
}) {
  const url = new URL(GOOGLE_AUTHORIZATION_URL);
  url.searchParams.set("client_id", readRequiredEnv("GOOGLE_CLIENT_ID"));
  url.searchParams.set("redirect_uri", getGoogleRedirectUri(origin));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  return url;
}

export function sanitizeAuthNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function buildAuthRedirect(origin: string, path: string, error?: string) {
  if (!error) {
    return new URL(sanitizeAuthNextPath(path), origin);
  }

  const url = new URL("/auth", origin);
  url.searchParams.set("error", error);
  url.searchParams.set("next", sanitizeAuthNextPath(path));
  return url;
}

async function exchangeGoogleCode({
  code,
  origin,
}: {
  code: string;
  origin: string;
}) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: readRequiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: readRequiredEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: getGoogleRedirectUri(origin),
      grant_type: "authorization_code",
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as GoogleTokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new CommunityError("Unable to verify Google sign-in.", 401);
  }

  return payload;
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as GoogleUserInfo;

  if (!response.ok || !payload.sub || !payload.email) {
    throw new CommunityError("Unable to read your Google profile.", 401);
  }

  if (!payload.email_verified) {
    throw new CommunityError("Google account email must be verified.", 403);
  }

  return {
    providerAccountId: payload.sub,
    email: payload.email.trim().toLowerCase(),
    name: payload.name?.trim() || null,
    picture: payload.picture?.trim() || null,
  };
}

async function buildGoogleUsername() {
  return generateUniqueUsername();
}

function getInternalGoogleAvatar(username: string, email: string, image: string | null) {
  if (typeof image === "string") {
    const trimmed = image.trim();

    if (trimmed.startsWith("/avatars/")) {
      return trimmed;
    }
  }

  return getDefaultAvatarPath(username, email);
}

export async function signInWithGoogleCode({
  code,
  origin,
}: {
  code: string;
  origin: string;
}) {
  const token = await exchangeGoogleCode({ code, origin });
  const googleUser = await fetchGoogleUserInfo(token.access_token!);
  const now = new Date();
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: googleUser.providerAccountId,
      },
    },
    select: {
      userId: true,
    },
  });

  if (account) {
    const user = await prisma.user.findUnique({
      where: {
        id: account.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new CommunityError("Linked Google account is missing its user record.", 500);
    }

    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleUser.providerAccountId,
        },
      },
      data: {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_in ? Math.floor(Date.now() / 1000) + token.expires_in : null,
        token_type: token.token_type,
        scope: token.scope,
        id_token: token.id_token,
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: now,
        image: getInternalGoogleAvatar(user.username, googleUser.email, user.image),
        lastLoginAt: now,
      },
    });

    return user.id;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: googleUser.email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
    },
  });

  if (existingUser) {
    await prisma.account.create({
      data: {
        userId: existingUser.id,
        type: "oauth",
        provider: "google",
        providerAccountId: googleUser.providerAccountId,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_in ? Math.floor(Date.now() / 1000) + token.expires_in : null,
        token_type: token.token_type,
        scope: token.scope,
        id_token: token.id_token,
      },
    });

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: now,
        image: getInternalGoogleAvatar(
          existingUser.username,
          existingUser.email ?? googleUser.email,
          existingUser.image
        ),
        lastLoginAt: now,
      },
    });

    return existingUser.id;
  }

  const username = await buildGoogleUsername();
  const user = await prisma.user.create({
    data: {
      username,
      email: googleUser.email,
      emailVerified: now,
      image: getDefaultAvatarPath(username, googleUser.email),
      businessPhones: [],
      lastLoginAt: now,
      accounts: {
        create: {
          type: "oauth",
          provider: "google",
          providerAccountId: googleUser.providerAccountId,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          expires_at: token.expires_in ? Math.floor(Date.now() / 1000) + token.expires_in : null,
          token_type: token.token_type,
          scope: token.scope,
          id_token: token.id_token,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return user.id;
}
