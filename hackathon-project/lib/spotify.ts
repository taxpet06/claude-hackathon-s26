import { SpotifyTrack } from "@/types/spotify";

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to fetch Spotify token");
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

export async function getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=30&fields=items(track(id,name,artists,album,preview_url,popularity,external_urls))`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Spotify playlist fetch failed: ${res.status}`);
  const data = await res.json();

  return (data.items as any[])
    .map((item: any) => item.track)
    .filter((t: any) => t?.id)
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.[0]?.name ?? "Unknown",
      albumArt: t.album?.images?.[0]?.url ?? "",
      previewUrl: t.preview_url ?? null,
      popularity: t.popularity ?? 0,
      spotifyUrl: t.external_urls?.spotify ?? "",
    }));
}

export async function searchTracks(query: string, limit = 20): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Spotify search failed: ${res.status}`);
  const data = await res.json();

  return (data.tracks?.items ?? [])
    .filter((t: any) => t?.id)
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.[0]?.name ?? "Unknown",
      albumArt: t.album?.images?.[0]?.url ?? "",
      previewUrl: t.preview_url ?? null,
      popularity: t.popularity ?? 0,
      spotifyUrl: t.external_urls?.spotify ?? "",
    }));
}

export async function searchPlaylists(query: string): Promise<string | null> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=5`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.playlists?.items?.[0]?.id ?? null;
}
