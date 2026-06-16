import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CommunityError, likePost, unlikePost } from "@/lib/community";
import { getCurrentSessionUserFromRequest } from "@/lib/session";

type RouteContext = {
  params: {
    postId: string;
  };
};

async function requireCurrentUser(request: NextRequest) {
  const currentUser = await getCurrentSessionUserFromRequest(request);

  if (!currentUser) {
    throw new CommunityError("Sign in to react to posts.", 401);
  }

  return currentUser;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const currentUser = await requireCurrentUser(request);
    const result = await likePost(params.postId, {
      userId: currentUser.id,
      userEmail: currentUser.email,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json({ error: "Failed to like post." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const currentUser = await requireCurrentUser(request);
    const result = await unlikePost(params.postId, {
      userId: currentUser.id,
      userEmail: currentUser.email,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to remove like." },
      { status: 500 }
    );
  }
}
