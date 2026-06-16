import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  CommunityError,
  createSubtopicPost,
  listSubtopicPosts,
} from "@/lib/community";
import { getCurrentSessionUserFromRequest } from "@/lib/session";

type RouteContext = {
  params: {
    subtopicId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentSessionUserFromRequest(request);
    const posts = await listSubtopicPosts(params.subtopicId, currentUser?.id);
    return NextResponse.json({ posts });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to load subtopic posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();

    const post = await createSubtopicPost(params.subtopicId, {
      body: body.body,
      authorId: body.authorId,
      parentPostId: body.parentPostId,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subtopic post." },
      { status: 500 }
    );
  }
}
