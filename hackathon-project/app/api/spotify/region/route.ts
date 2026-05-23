import { NextRequest, NextResponse } from "next/server";
import { getPlaylistTracks } from "@/lib/spotify";
import { findRegionById } from "@/lib/regions";

export async function GET(req: NextRequest) {
  const regionId = req.nextUrl.searchParams.get("regionId");
  if (!regionId) return NextResponse.json({ error: "regionId required" }, { status: 400 });

  const region = findRegionById(regionId);
  if (!region) return NextResponse.json({ error: "Region not found" }, { status: 404 });

  try {
    const tracks = await getPlaylistTracks(region.playlistId);
    return NextResponse.json({
      region: { id: region.id, name: region.name, coords: region.coords },
      tracks,
    });
  } catch (err) {
    console.error("Spotify region error:", err);
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}
