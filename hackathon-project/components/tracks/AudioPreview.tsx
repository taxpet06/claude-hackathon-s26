"use client";

import { useRef, useState } from "react";

type Props = { previewUrl: string | null };

export default function AudioPreview({ previewUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!previewUrl) {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 cursor-not-allowed"
        title="No preview available"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <polygon points="2,1 9,5 2,9" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>
    );
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      document.querySelectorAll("audio").forEach((a) => {
        if (a !== audio) a.pause();
      });
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <div>
      <audio ref={audioRef} src={previewUrl} onEnded={() => setPlaying(false)} preload="none" />
      <button
        onClick={toggle}
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          playing ? "bg-green-500 hover:bg-green-400" : "bg-white/10 hover:bg-white/20"
        }`}
        title={playing ? "Pause" : "Play 30s preview"}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
            <rect x="1" y="1" width="3" height="8" />
            <rect x="6" y="1" width="3" height="8" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
            <polygon points="2,1 9,5 2,9" />
          </svg>
        )}
      </button>
    </div>
  );
}
