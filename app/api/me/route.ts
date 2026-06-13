import { NextRequest, NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import { getProfilePayload, updateProfilePayload } from "@/lib/profile";
import { getCurrentSessionUserFromRequest } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getCurrentSessionUserFromRequest(request);

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const profile = await getProfilePayload(sessionUser.id);

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to load profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getCurrentSessionUserFromRequest(request);

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const profile = await updateProfilePayload({
      userId: sessionUser.id,
      name: body.name,
      username: body.username,
      image: body.image,
      givenName: body.givenName,
      surname: body.surname,
      jobTitle: body.jobTitle,
      department: body.department,
      companyName: body.companyName,
      officeLocation: body.officeLocation,
      mobilePhone: body.mobilePhone,
    });

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof CommunityError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
