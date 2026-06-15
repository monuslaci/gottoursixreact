import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import {
  buildSessionCookieOptions,
  createAuthSession,
  mapPublicSessionUser,
  normalizeAuthIdentifier,
  verifyPassword,
} from "@/lib/session";
import { prisma } from "@/lib/prisma";

function readText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      identifier?: unknown;
      username?: unknown;
      email?: unknown;
      password?: unknown;
    };

    const identifier = readText(body.identifier) ?? readText(body.username) ?? readText(body.email);
    const password = readText(body.password);

    if (!identifier) {
      throw new CommunityError("Username or email is required.", 400);
    }

    if (!password) {
      throw new CommunityError("Password is required.", 400);
    }

    const normalized = normalizeAuthIdentifier(identifier);
    const user = await prisma.user.findFirst({
      where: normalized.username
        ? { username: normalized.username }
        : { email: normalized.email },
    });

    if (!user || !user.passwordHash || !user.passwordSalt) {
      throw new CommunityError("Invalid username/email or password.", 401);
    }

    if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      throw new CommunityError("Invalid username/email or password.", 401);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const session = await createAuthSession(user.id);
    const refreshedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
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

    const response = NextResponse.json({
      authenticated: true,
      user: refreshedUser ? mapPublicSessionUser(refreshedUser) : null,
      expiresAt: session.expires.toISOString(),
    });

    response.cookies.set(buildSessionCookieOptions(session.token, session.expires));

    return response;
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Unable to sign in." },
      { status: 500 }
    );
  }
}
