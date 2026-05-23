import { NextRequest, NextResponse } from "next/server";
import { getRegionTracks, searchTracks } from "@/lib/spotify";
import { findRegionByQuery } from "@/lib/regions";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "q required" }, { status: 400 });

  try {
    // Try matching a known region first
    const region = findRegionByQuery(q);
    if (region) {
      const tracks = await getRegionTracks(region.name, region.country);
      return NextResponse.json({
        query: q,
        region: { id: region.id, name: region.name, coords: region.coords },
        tracks,
      });
    }

    // Fallback: search by text query directly
    const tracks = await searchTracks(q, 20);
    return NextResponse.json({ query: q, tracks });
  } catch (err) {
    console.error("Spotify search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
