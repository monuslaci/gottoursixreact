import { NextResponse } from "next/server";

import { CommunityError } from "@/lib/community";
import { getProfilePayload, updateProfilePayload } from "@/lib/profile";

function readIdentity(request: Request) {
  const url = new URL(request.url);

  return {
    userId: url.searchParams.get("userId"),
  };
}

export async function GET(request: Request) {
  try {
    const identity = readIdentity(request);
    const profile = await getProfilePayload(identity.userId);

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

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const profile = await updateProfilePayload({
      userId: body.userId ?? null,
      name: body.name,
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
