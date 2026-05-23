import { useState } from "react";
import { SpotifyTrack } from "@/types/spotify";

type SearchResult = {
  query: string;
  tracks: SpotifyTrack[];
  region?: { id: string; name: string; coords: [number, number] };
};

export function useSpotifySearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setResults(null);
    setError(null);
  }

  return { results, loading, error, search, clear };
}
