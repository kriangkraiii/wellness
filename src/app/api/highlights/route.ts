import { NextResponse } from "next/server";
import { getHighlights } from "@/lib/highlights";

export async function GET() {
  return NextResponse.json({
    data: getHighlights(),
    generatedAt: new Date().toISOString(),
  });
}
