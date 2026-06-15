import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import {
  buildSessionCookieOptions,
  createAuthSession,
  hashPassword,
  mapPublicSessionUser,
} from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/profile";

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
      username?: unknown;
      email?: unknown;
      password?: unknown;
      confirmPassword?: unknown;
    };

    const username = normalizeUsername(readText(body.username));
    const email = readText(body.email)?.toLowerCase() ?? null;
    const password = readText(body.password);
    const confirmPassword = readText(body.confirmPassword);

    if (!username) {
      throw new CommunityError("Username is required.", 400);
    }

    if (!email) {
      throw new CommunityError("Email is required.", 400);
    }

    if (!password || password.length < 8) {
      throw new CommunityError("Password must be at least 8 characters.", 400);
    }

    if (confirmPassword && confirmPassword !== password) {
      throw new CommunityError("Passwords do not match.", 400);
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (existing) {
      throw new CommunityError("That username or email is already in use.", 409);
    }

    const passwordRecord = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: null,
        username,
        email,
        passwordHash: passwordRecord.hash,
        passwordSalt: passwordRecord.salt,
        businessPhones: [],
      },
    });

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
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "That username or email is already in use." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 }
    );
  }
}
