import { NextRequest, NextResponse } from "next/server";
import { getPlaylistTracks, searchTracks, searchPlaylists } from "@/lib/spotify";
import { findRegionByQuery } from "@/lib/regions";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "q required" }, { status: 400 });

  try {
    // Try matching a known region first
    const region = findRegionByQuery(q);
    if (region) {
      const tracks = await getPlaylistTracks(region.playlistId);
      return NextResponse.json({
        query: q,
        region: { id: region.id, name: region.name, coords: region.coords },
        tracks,
      });
    }

    // Fallback: search for a Top 50 playlist by country name
    const playlistId = await searchPlaylists(`Top 50 ${q}`);
    if (playlistId) {
      const tracks = await getPlaylistTracks(playlistId);
      return NextResponse.json({ query: q, tracks });
    }

    // Final fallback: Spotify track search
    const tracks = await searchTracks(q, 20);
    return NextResponse.json({ query: q, tracks });
  } catch (err) {
    console.error("Spotify search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
