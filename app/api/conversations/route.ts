import { NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import { createOrOpenConversation, listConversations } from "@/lib/messages";

function readIdentity(request: Request) {
  const url = new URL(request.url);

  return {
    userId: url.searchParams.get("userId"),
    userEmail: url.searchParams.get("userEmail"),
  };
}

export async function GET(request: Request) {
  try {
    const identity = readIdentity(request);
    const payload = await listConversations(identity);

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to load conversations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const payload = await createOrOpenConversation({
      userId: body.userId ?? null,
      userEmail: body.userEmail ?? null,
      recipientId: body.recipientId ?? null,
      recipientEmail: body.recipientEmail ?? null,
      body: body.body ?? null,
    });

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to create conversation." },
      { status: 500 }
    );
  }
}
