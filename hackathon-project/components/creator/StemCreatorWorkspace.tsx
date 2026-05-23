"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { StemSlot, StemType, StemUrls } from "@/types/stems";
import { SpotifyTrack } from "@/types/spotify";
import SongSearchPanel from "./SongSearchPanel";
import StemTrack from "./StemTrack";
import MixerCanvas from "./MixerCanvas";
import PublishModal from "./PublishModal";
import { useStemSeparate } from "@/hooks/useStemSeparation";
import { useRouter } from "next/navigation";

export default function StemCreatorWorkspace() {
  const [slots, setSlots] = useState<StemSlot[]>([]);
  const [mixBlob, setMixBlob] = useState<Blob | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const { mutateAsync: startSeparation } = useStemSeparate();
  const router = useRouter();

  const addTrack = useCallback(async (track: SpotifyTrack) => {
    if (slots.length >= 4) return;
    if (slots.some((s) => s.trackId === track.id)) return;
    if (!track.previewUrl) return;

    const id = uuidv4();
    const newSlot: StemSlot = {
      id,
      trackId: track.id,
      trackName: track.name,
      artistName: track.artist,
      previewUrl: track.previewUrl,
      stemType: "drums",
      predictionId: null,
      status: "starting",
      stemUrls: null,
      audioBuffer: null,
    };
    setSlots((prev) => [...prev, newSlot]);

    try {
      const result = await startSeparation({ previewUrl: track.previewUrl, trackId: track.id });
      setSlots((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, predictionId: result.predictionId, status: "processing" } : s
        )
      );
    } catch {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: "failed" } : s)));
    }
  }, [slots, startSeparation]);

  function changeStemType(id: string, stemType: StemType) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, stemType } : s)));
  }

  function stemsReady(id: string, stemUrls: StemUrls) {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "succeeded", stemUrls } : s))
    );
  }

  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  function handleMixReady(blob: Blob) {
    setMixBlob(blob);
    setShowPublish(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Stem Creator</h1>
        <p className="text-gray-400 text-sm mt-1">
          Search for tracks, choose a stem from each, and mix them into something new.
        </p>
      </div>

      <SongSearchPanel onTrackSelect={addTrack} />

      {slots.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-300">Your stems</h2>
          {slots.map((slot) => (
            <StemTrack
              key={slot.id}
              slot={slot}
              onStemTypeChange={changeStemType}
              onStemsReady={stemsReady}
              onRemove={removeSlot}
            />
          ))}
        </div>
      )}

      {slots.length > 0 && (
        <MixerCanvas slots={slots} onMixReady={handleMixReady} />
      )}

      {slots.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🎛️</p>
          <p className="text-sm">Search for a song above to get started</p>
        </div>
      )}

      {showPublish && mixBlob && (
        <PublishModal
          mixBlob={mixBlob}
          slots={slots}
          onClose={() => setShowPublish(false)}
          onPublished={() => { setShowPublish(false); router.push("/community"); }}
        />
      )}
    </div>
  );
}
