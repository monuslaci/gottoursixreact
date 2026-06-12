import { NextResponse } from "next/server";

import { CommunityError, updateSuggestionStatus } from "@/lib/community";

type RouteContext = {
  params: {
    suggestionId: string;
  };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json().catch(() => ({}));

    const suggestion = await updateSuggestionStatus(params.suggestionId, {
      status: body.status,
      reviewedById: body.reviewedById,
      reviewedByEmail: body.reviewedByEmail,
    });

    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to update suggestion." },
      { status: 500 }
    );
  }
}
