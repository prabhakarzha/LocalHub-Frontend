import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ events: [], message: "Events API is working" });
}
