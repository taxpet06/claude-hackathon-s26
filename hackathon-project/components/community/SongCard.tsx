"use client";

import { CommunitySong } from "@/types/community";

type Props = { song: CommunitySong; onClick: (song: CommunitySong) => void };

const STEM_COLORS: Record<string, string> = {
  drums: "bg-orange-500/20 text-orange-300",
  bass: "bg-blue-500/20 text-blue-300",
  vocals: "bg-pink-500/20 text-pink-300",
  other: "bg-purple-500/20 text-purple-300",
};

export default function SongCard({ song, onClick }: Props) {
  const date = new Date(song.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={() => onClick(song)}
      className="bg-gray-800/60 hover:bg-gray-800/90 border border-white/10 hover:border-white/20 rounded-xl p-5 cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-green-300 transition-colors">
            {song.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">by {song.creator_name} · {date}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-green-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polygon points="2,1 11,6 2,11" fill="currentColor" className="text-white" />
          </svg>
        </div>
      </div>

      {song.description && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{song.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {song.stems_used.map((s, i) => (
          <span
            key={i}
            className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${
              STEM_COLORS[s.stem] ?? "bg-gray-700 text-gray-300"
            }`}
          >
            {s.stem} — {s.fromArtist}
          </span>
        ))}
      </div>
    </div>
  );
}
