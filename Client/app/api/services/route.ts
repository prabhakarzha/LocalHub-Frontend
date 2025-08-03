import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    services: [],
    message: "Services API is working",
  });
}
