import { NextRequest, NextResponse } from "next/server";
import { startStemSeparation } from "@/lib/replicate";

export async function POST(req: NextRequest) {
  const { previewUrl, trackId } = await req.json();
  if (!previewUrl) return NextResponse.json({ error: "previewUrl required" }, { status: 400 });

  try {
    const predictionId = await startStemSeparation(previewUrl);
    return NextResponse.json({ predictionId, status: "starting" });
  } catch (err) {
    console.error("Stem separation error:", err);
    return NextResponse.json({ error: "Failed to start stem separation", detail: String(err) }, { status: 500 });
  }
}
