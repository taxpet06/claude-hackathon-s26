// Uses iTunes Search API (free, no key needed) instead of Spotify
import { SpotifyTrack } from "@/types/spotify";

function mapItunesTrack(t: any): SpotifyTrack {
  return {
    id: t.trackId?.toString() ?? t.collectionId?.toString() ?? Math.random().toString(),
    name: t.trackName ?? t.collectionName ?? "Unknown",
    artist: t.artistName ?? "Unknown",
    albumArt: t.artworkUrl100?.replace("100x100", "300x300") ?? "",
    previewUrl: t.previewUrl ?? null,
    popularity: 0,
    spotifyUrl: t.trackViewUrl ?? "",
  };
}

export async function getRegionTracks(regionName: string, countryCode: string): Promise<SpotifyTrack[]> {
  // Try country top chart first
  try {
    const chartRes = await fetch(
      `https://itunes.apple.com/${countryCode}/rss/topsongs/limit=25/json`,
      { next: { revalidate: 3600 } }
    );
    if (chartRes.ok) {
      const data = await chartRes.json();
      const entries: any[] = data?.feed?.entry ?? [];
      if (entries.length > 0) {
        // Chart feed format is different — fetch full track data for preview URLs
        const ids = entries.slice(0, 20).map((e: any) => e.id?.attributes?.["im:id"]).filter(Boolean).join(",");
        if (ids) {
          const lookupRes = await fetch(`https://itunes.apple.com/lookup?id=${ids}&entity=song`);
          if (lookupRes.ok) {
            const lookupData = await lookupRes.json();
            const tracks = (lookupData.results ?? []).filter((t: any) => t.kind === "song").map(mapItunesTrack);
            if (tracks.length > 0) return tracks;
          }
        }
      }
    }
  } catch {}

  // Fallback: search by region name
  return searchTracks(regionName, 20, countryCode);
}

export async function searchTracks(query: string, limit = 20, country = "US"): Promise<SpotifyTrack[]> {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&country=${country}&limit=${limit}`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).filter((t: any) => t.kind === "song").map(mapItunesTrack);
}

// Keep for backwards compat with search route
export async function searchPlaylists(_query: string): Promise<string | null> {
  return null;
}
