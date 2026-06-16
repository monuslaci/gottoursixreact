import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CommunityError, updatePost } from "@/lib/community";
import { getCurrentSessionUserFromRequest } from "@/lib/session";

type RouteContext = {
  params: {
    postId: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentSessionUserFromRequest(request);

    if (!currentUser) {
      throw new CommunityError("Sign in to edit your posts.", 401);
    }

    const body = await request.json().catch(() => ({}));
    const post = await updatePost(params.postId, {
      body: body.body ?? "",
      userId: currentUser.id,
      userEmail: currentUser.email,
    });

    return NextResponse.json({ post });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}
