import { NextResponse } from "next/server";

import {
  CommunityError,
  getTopicSubscriptionStatus,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@/lib/community";

type RouteContext = {
  params: {
    topicId: string;
  };
};

function readSubscriberIdentity(request: Request) {
  const url = new URL(request.url);

  return {
    userId: url.searchParams.get("userId"),
    userEmail: url.searchParams.get("userEmail"),
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const identity = readSubscriberIdentity(request);
    const isSubscribed = await getTopicSubscriptionStatus(params.topicId, identity);

    return NextResponse.json({ isSubscribed });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to load topic subscription state." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json().catch(() => ({}));

    await subscribeToTopic(params.topicId, {
      userId: body.userId ?? null,
      userEmail: body.userEmail ?? null,
    });

    return NextResponse.json({ isSubscribed: true });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to subscribe to topic." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json().catch(() => ({}));

    await unsubscribeFromTopic(params.topicId, {
      userId: body.userId ?? null,
      userEmail: body.userEmail ?? null,
    });

    return NextResponse.json({ isSubscribed: false });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to unsubscribe from topic." },
      { status: 500 }
    );
  }
}
