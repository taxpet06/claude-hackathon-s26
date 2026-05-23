"use client";

import Image from "next/image";
import { SpotifyTrack } from "@/types/spotify";
import AudioPreview from "./AudioPreview";

type Props = {
  track: SpotifyTrack;
  action?: { label: string; onClick: (track: SpotifyTrack) => void; requiresPreview?: boolean };
};

export default function TrackCard({ track, action }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-700">
        {track.albumArt && (
          <Image src={track.albumArt} alt={track.name} fill className="object-cover" unoptimized />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{track.name}</p>
        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <AudioPreview previewUrl={track.previewUrl} />
        {action && (
          <button
            onClick={() => action.onClick(track)}
            disabled={action.requiresPreview && !track.previewUrl}
            title={action.requiresPreview && !track.previewUrl ? "No audio preview available" : undefined}
            className="text-xs bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white px-2.5 py-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
