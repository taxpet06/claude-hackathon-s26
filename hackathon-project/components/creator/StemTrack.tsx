"use client";

import { StemSlot, StemType } from "@/types/stems";
import { useStemStatus } from "@/hooks/useStemSeparation";
import { useEffect } from "react";

const STEM_LABELS: Record<StemType, string> = {
  drums: "Drums",
  bass: "Bass",
  vocals: "Vocals",
  other: "Guitar / Other",
};

type Props = {
  slot: StemSlot;
  onStemTypeChange: (id: string, stemType: StemType) => void;
  onStemsReady: (id: string, stemUrls: NonNullable<StemSlot["stemUrls"]>) => void;
  onRemove: (id: string) => void;
};

export default function StemTrack({ slot, onStemTypeChange, onStemsReady, onRemove }: Props) {
  const { data: statusData } = useStemStatus(slot.predictionId);

  useEffect(() => {
    if (statusData?.status === "succeeded" && statusData.stems) {
      onStemsReady(slot.id, statusData.stems);
    }
  }, [statusData?.status]);

  const status = statusData?.status ?? slot.status;

  return (
    <div className="bg-gray-800/60 border border-white/10 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{slot.trackName}</p>
          <p className="text-xs text-gray-400 truncate">{slot.artistName}</p>
        </div>
        <button
          onClick={() => onRemove(slot.id)}
          className="text-gray-500 hover:text-white transition-colors text-lg leading-none flex-shrink-0"
        >
          ×
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs text-gray-400">Use stem:</label>
        <select
          value={slot.stemType}
          onChange={(e) => onStemTypeChange(slot.id, e.target.value as StemType)}
          className="flex-1 bg-gray-700 text-white text-xs border border-white/10 rounded px-2 py-1.5 focus:outline-none"
        >
          {Object.entries(STEM_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        {status === "idle" || status === "starting" || status === "processing" ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
            {status === "idle" ? "Queued…" : status === "starting" ? "Starting Demucs…" : "Separating stems…"}
          </div>
        ) : status === "succeeded" ? (
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Stems ready — {STEM_LABELS[slot.stemType]} selected
          </div>
        ) : status === "failed" ? (
          <p className="text-xs text-red-400">Separation failed. Try again.</p>
        ) : null}
      </div>
    </div>
  );
}
