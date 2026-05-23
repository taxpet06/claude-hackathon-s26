"use client";

import { useState, useRef } from "react";
import { useSpotifySearch } from "@/hooks/useSpotifySearch";
import { SpotifyTrack } from "@/types/spotify";
import TrackList from "@/components/tracks/TrackList";

type Props = {
  onRegionFound?: (coords: [number, number]) => void;
};

export default function MapSearchBar({ onRegionFound }: Props) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { results, loading, error, search, clear } = useSpotifySearch();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    search(query);
    setShowResults(true);
  }

  function handleClear() {
    setQuery("");
    clear();
    setShowResults(false);
    inputRef.current?.focus();
  }

  // Fly to region if a known region was matched
  if (results?.region?.coords && onRegionFound) {
    onRegionFound(results.region.coords);
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a country, city, or region..."
            className="w-full bg-gray-900/90 backdrop-blur text-white placeholder-gray-400 border border-white/20 rounded-full px-5 py-2.5 pr-20 text-sm focus:outline-none focus:border-white/40 shadow-xl"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1 text-xs transition-colors"
          >
            {loading ? "..." : "Go"}
          </button>
        </div>
      </form>

      {showResults && results && (
        <div className="mt-2 bg-gray-900/95 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {results.region
                ? `Top tracks from ${results.region.name}`
                : `Results for "${results.query}"`}
            </p>
            <button onClick={() => setShowResults(false)} className="text-gray-400 hover:text-white text-sm">
              ×
            </button>
          </div>
          <TrackList tracks={results.tracks} />
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
