import { NextResponse } from "next/server";

import {
  CommunityError,
  softDeleteTopic,
  updateTopic,
} from "@/lib/community";

type RouteContext = {
  params: {
    topicId: string;
  };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();

    const topic = await updateTopic(params.topicId, {
      title: body.title,
      description: body.description,
      tags: body.tags,
    });

    return NextResponse.json({ topic });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to update topic." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const topic = await softDeleteTopic(params.topicId);

    return NextResponse.json({ topic });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete topic." },
      { status: 500 }
    );
  }
}
