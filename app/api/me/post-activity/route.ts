import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { listMyPostActivity } from "@/lib/community";
import { getCurrentSessionUserFromRequest } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentSessionUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "A member profile is required to load your posts." },
        { status: 401 }
      );
    }

    const activity = await listMyPostActivity(currentUser.id);
    return NextResponse.json(activity);
  } catch {
    return NextResponse.json(
      { error: "Failed to load your post activity." },
      { status: 500 }
    );
  }
}
