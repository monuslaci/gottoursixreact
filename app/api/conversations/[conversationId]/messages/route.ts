import { NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import {
  getConversationMessages,
  sendConversationMessage,
} from "@/lib/messages";

type RouteContext = {
  params: {
    conversationId: string;
  };
};

function readIdentity(request: Request) {
  const url = new URL(request.url);

  return {
    userId: url.searchParams.get("userId"),
    userEmail: url.searchParams.get("userEmail"),
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const identity = readIdentity(request);
    const payload = await getConversationMessages(params.conversationId, identity);

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to load conversation messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json().catch(() => ({}));

    const message = await sendConversationMessage(params.conversationId, {
      userId: body.userId ?? null,
      userEmail: body.userEmail ?? null,
      body: body.body ?? null,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
