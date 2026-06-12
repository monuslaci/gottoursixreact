import { NextResponse } from "next/server";

import { CommunityError, createSuggestion, listSuggestions } from "@/lib/community";

export async function GET() {
  try {
    const suggestions = await listSuggestions();
    return NextResponse.json({ suggestions });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to load suggestions." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const suggestion = await createSuggestion({
      kind: body.kind,
      title: body.title,
      description: body.description,
      topicId: body.topicId,
      suggestedById: body.suggestedById,
      suggestedByEmail: body.suggestedByEmail,
    });

    return NextResponse.json({ suggestion }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to create suggestion." },
      { status: 500 }
    );
  }
}
