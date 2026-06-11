import { NextResponse } from "next/server";

const payload = {
  error: "Authentication is not configured yet.",
  status: "placeholder",
};

export async function GET() {
  return NextResponse.json(payload, { status: 501 });
}

export async function POST() {
  return NextResponse.json(payload, { status: 501 });
}

