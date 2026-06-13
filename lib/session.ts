import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/profile";

export const SESSION_COOKIE_NAME = "six_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;
const PASSWORD_ITERATIONS = 210_000;
const PASSWORD_KEY_LENGTH = 32;

export type PublicSessionUser = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  image: string | null;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  department: string | null;
  companyName: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
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
  return new Date(Date.now() + SESSION_DURATION_MS);
}

export function mapPublicSessionUser(user: {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  image: string | null;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  department: string | null;
  companyName: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}): PublicSessionUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image,
    givenName: user.givenName,
    surname: user.surname,
    jobTitle: user.jobTitle,
    department: user.department,
    companyName: user.companyName,
    officeLocation: user.officeLocation,
    mobilePhone: user.mobilePhone,
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
          name: true,
          username: true,
          email: true,
          image: true,
          givenName: true,
          surname: true,
          jobTitle: true,
          department: true,
          companyName: true,
          officeLocation: true,
          mobilePhone: true,
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
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await loadSessionByToken(token);
  return session?.user ?? null;
}

export async function getCurrentSessionUserFromRequest(request: NextRequest) {
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

export function normalizeAuthName(value: string | null | undefined) {
  return normalizeText(value);
}
