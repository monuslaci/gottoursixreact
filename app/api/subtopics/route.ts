import { NextResponse } from "next/server";

import { CommunityError, createSubtopic, listAdminSubtopics } from "@/lib/community";

export async function GET() {
  try {
    const subtopics = await listAdminSubtopics();
    return NextResponse.json({ subtopics });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to load subtopics." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const subtopic = await createSubtopic({
      topicId: body.topicId,
      title: body.title,
      description: body.description,
      sortOrder: body.sortOrder,
      createdById: body.createdById,
    });

    return NextResponse.json({ subtopic }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subtopic." },
      { status: 500 }
    );
  }
}
