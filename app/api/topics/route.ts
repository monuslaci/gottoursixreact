import { NextResponse } from "next/server";

import { CommunityError, createTopic, listTopics } from "@/lib/community";

export async function GET() {
  const topics = await listTopics();
  return NextResponse.json({ topics });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const topic = await createTopic({
      title: body.title,
      description: body.description,
      tags: body.tags,
      createdById: body.createdById,
    });

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to create topic." },
      { status: 500 }
    );
  }
}
