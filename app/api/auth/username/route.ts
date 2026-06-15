import { NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import { generateUniqueUsername } from "@/lib/profile";

export async function GET() {
  try {
    const username = await generateUniqueUsername();

    return NextResponse.json(
      { username },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json(
      { error: "Unable to generate a username." },
      { status: 500 }
    );
  }
}
