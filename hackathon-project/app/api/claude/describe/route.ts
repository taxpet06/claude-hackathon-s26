import { NextRequest, NextResponse } from "next/server";
import { generateMashupDescription } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { stemsUsed, userTitle } = await req.json();
  if (!stemsUsed || !userTitle) {
    return NextResponse.json({ error: "stemsUsed and userTitle required" }, { status: 400 });
  }

  try {
    const description = await generateMashupDescription(userTitle, stemsUsed);
    return NextResponse.json({ description });
  } catch (err) {
    console.error("Claude describe error:", err);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
