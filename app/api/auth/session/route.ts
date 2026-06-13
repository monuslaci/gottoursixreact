import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUserFromRequest } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getCurrentSessionUserFromRequest(request);

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
  });
}
