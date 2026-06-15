import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { prisma } from "@/lib/prisma";
import { generateUniqueUsername, normalizeUsername } from "@/lib/profile";

export const SESSION_COOKIE_NAME = "six_session";
const MINIMUM_SESSION_DAYS = 3;
const DEFAULT_SESSION_DAYS = 14;
const PASSWORD_ITERATIONS = 210_000;
const PASSWORD_KEY_LENGTH = 32;
const AUTH_DISABLED = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
const DEV_USER_EMAIL = normalizeEmail(process.env.NEXT_PUBLIC_DEV_USER_EMAIL);
const DEV_USER_NAME = normalizeText(process.env.NEXT_PUBLIC_DEV_USER_NAME);
const SESSION_DURATION_DAYS = readSessionDurationDays(
  process.env.AUTH_SESSION_DURATION_DAYS
);

export type PublicSessionUser = {
  id: string;
  username: string;
  email: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

function normalizeEmail(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeText(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readSessionDurationDays(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_SESSION_DAYS;
  }

  return Math.max(MINIMUM_SESSION_DAYS, Math.floor(parsed));
}

async function buildDevUsername(email: string, fallbackLabel: string | null) {
  const emailLocalPart = email.split("@")[0] ?? "";
  const candidates = [
    normalizeUsername(emailLocalPart),
    normalizeUsername(fallbackLabel),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const existing = await prisma.user.findUnique({
      where: {
        username: candidate,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!existing || existing.email === email) {
      return candidate;
    }
  }

  return generateUniqueUsername();
}

async function getDevSessionUser() {
  if (!AUTH_DISABLED || !DEV_USER_EMAIL) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: DEV_USER_EMAIL,
    },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  if (existingUser) {
    return mapPublicSessionUser(existingUser);
  }

  const username = await buildDevUsername(DEV_USER_EMAIL, DEV_USER_NAME);
  const createdUser = await prisma.user.create({
    data: {
      email: DEV_USER_EMAIL,
      username,
      businessPhones: [],
      lastLoginAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  return mapPublicSessionUser(createdUser);
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(
    password,
    salt,
    PASSWORD_ITERATIONS,
    PASSWORD_KEY_LENGTH,
    "sha256"
  ).toString("hex");

  return {
    salt,
    hash,
  };
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
) {
  const actualHash = hashPassword(password, salt).hash;

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function buildSessionExpiresAt() {
  return new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

export function getSessionDurationDays() {
  return SESSION_DURATION_DAYS;
}

export function buildSessionCookieOptions(
  token: string,
  expires: Date
): ResponseCookie {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  };
}

export function buildExpiredSessionCookieOptions(): ResponseCookie {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}

export function mapPublicSessionUser(user: {
  id: string;
  username: string;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}): PublicSessionUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
  };
}

async function loadSessionByToken(token: string) {
  const session = await prisma.session.findUnique({
    where: {
      sessionToken: token,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expires.getTime() <= Date.now()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    return null;
  }

  return {
    session,
    user: mapPublicSessionUser(session.user),
  };
}

export async function getCurrentSessionUser() {
  const devUser = await getDevSessionUser();

  if (devUser) {
    return devUser;
  }

  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await loadSessionByToken(token);
  return session?.user ?? null;
}

export async function getCurrentSessionUserFromRequest(request: NextRequest) {
  const devUser = await getDevSessionUser();

  if (devUser) {
    return devUser;
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await loadSessionByToken(token);
  return session?.user ?? null;
}

export async function createAuthSession(userId: string) {
  const token = createSessionToken();
  const expires = buildSessionExpiresAt();

  await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expires,
    },
  });

  return {
    token,
    expires,
  };
}

export async function refreshAuthSession(token: string) {
  const expires = buildSessionExpiresAt();

  await prisma.session.updateMany({
    where: {
      sessionToken: token,
    },
    data: {
      expires,
    },
  });

  return {
    token,
    expires,
  };
}

export async function deleteAuthSession(token: string) {
  await prisma.session.deleteMany({
    where: {
      sessionToken: token,
    },
  });
}

export function normalizeAuthIdentifier(value: string | null | undefined) {
  const email = normalizeEmail(value);

  if (email?.includes("@")) {
    return {
      email,
      username: null,
    };
  }

  return {
    email: null,
    username: normalizeUsername(value),
  };
}
