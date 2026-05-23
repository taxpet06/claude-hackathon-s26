import { NextRequest, NextResponse } from "next/server";
import { getPredictionStatus } from "@/lib/replicate";

export async function GET(req: NextRequest) {
  const predictionId = req.nextUrl.searchParams.get("predictionId");
  if (!predictionId) return NextResponse.json({ error: "predictionId required" }, { status: 400 });

  try {
    const result = await getPredictionStatus(predictionId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Stem status error:", err);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }
}
