"use client";

import { useRef, useState } from "react";
import { CommunitySong } from "@/types/community";

type Props = { song: CommunitySong; onClose: () => void };

export default function SongPlayer({ song, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur border-t border-white/10 px-6 py-4 z-50 flex items-center gap-4">
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          playing ? "bg-green-500" : "bg-white/20 hover:bg-white/30"
        }`}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <rect x="1" y="1" width="4" height="10" />
            <rect x="7" y="1" width="4" height="10" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <polygon points="2,1 11,6 2,11" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{song.title}</p>
        <p className="text-xs text-gray-400 truncate">by {song.creator_name}</p>
      </div>

      <div className="hidden sm:flex items-center gap-2 flex-wrap">
        {song.stems_used.map((s, i) => (
          <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full capitalize">
            {s.stem}
          </span>
        ))}
      </div>

      <button onClick={onClose} className="text-gray-400 hover:text-white text-xl ml-2">×</button>

      <audio
        ref={audioRef}
        src={song.audio_url}
        onEnded={() => setPlaying(false)}
        preload="none"
      />
    </div>
  );
}
