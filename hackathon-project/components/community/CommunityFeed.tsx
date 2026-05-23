"use client";

import { useState } from "react";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import SongCard from "./SongCard";
import SongPlayer from "./SongPlayer";
import { CommunitySong } from "@/types/community";

export default function CommunityFeed() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCommunityFeed(page);
  const [activeSong, setActiveSong] = useState<CommunitySong | null>(null);

  return (
    <div className="pb-24">
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <p className="text-center text-gray-400 py-20">Failed to load songs. Please try again.</p>
      )}

      {data && data.songs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">🎵</p>
          <p className="text-sm">No songs yet. Be the first to create one!</p>
          <a href="/creator" className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300">
            Open Creator →
          </a>
        </div>
      )}

      {data && data.songs.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.songs.map((song) => (
              <SongCard key={song.id} song={song} onClick={setActiveSong} />
            ))}
          </div>

          {data.total > 20 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm text-gray-400 hover:text-white disabled:opacity-30 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500 flex items-center px-2">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= data.total}
                className="text-sm text-gray-400 hover:text-white disabled:opacity-30 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {activeSong && (
        <SongPlayer song={activeSong} onClose={() => setActiveSong(null)} />
      )}
    </div>
  );
}
