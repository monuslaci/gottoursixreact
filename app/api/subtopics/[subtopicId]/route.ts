import { NextResponse } from "next/server";

import {
  CommunityError,
  softDeleteSubtopic,
  updateSubtopic,
} from "@/lib/community";

type RouteContext = {
  params: {
    subtopicId: string;
  };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();

    const subtopic = await updateSubtopic(params.subtopicId, {
      title: body.title,
      description: body.description,
      sortOrder: body.sortOrder,
    });

    return NextResponse.json({ subtopic });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to update subtopic." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const subtopic = await softDeleteSubtopic(params.subtopicId);

    return NextResponse.json({ subtopic });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete subtopic." },
      { status: 500 }
    );
  }
}
