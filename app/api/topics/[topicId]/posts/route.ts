import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CommunityError, createTopicPost, listTopicPosts } from "@/lib/community";
import { getCurrentSessionUserFromRequest } from "@/lib/session";

type RouteContext = {
  params: {
    topicId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentSessionUserFromRequest(request);
    const posts = await listTopicPosts(params.topicId, currentUser?.id);
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load topic posts." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const body = await request.json();

    const post = await createTopicPost(params.topicId, {
      body: body.body,
      authorId: body.authorId,
      subtopicId: body.subtopicId,
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
      { error: "Failed to create post." },
      { status: 500 }
    );
  }
}
