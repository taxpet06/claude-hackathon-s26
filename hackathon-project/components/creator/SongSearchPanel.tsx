"use client";

import { useState } from "react";
import { SpotifyTrack } from "@/types/spotify";
import TrackList from "@/components/tracks/TrackList";

type Props = {
  onTrackSelect: (track: SpotifyTrack) => void;
};

export default function SongSearchPanel({ onTrackSelect }: Props) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTracks(data.tracks ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white mb-2">Add a track</h3>
        <form onSubmit={search} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any song..."
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 text-sm border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "…" : "Search"}
          </button>
        </form>
      </div>

      {tracks.length > 0 && (
        <div className="max-h-72 overflow-y-auto">
          <TrackList
            tracks={tracks}
            action={{ label: "+ Add", onClick: onTrackSelect, requiresPreview: true }}
          />
        </div>
      )}
    </div>
  );
}
