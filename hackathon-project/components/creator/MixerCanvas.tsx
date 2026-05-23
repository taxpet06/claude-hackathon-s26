"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AudioMixer } from "@/lib/webAudio";
import { StemSlot } from "@/types/stems";

type Props = {
  slots: StemSlot[];
  onMixReady: (blob: Blob) => void;
};

export default function MixerCanvas({ slots, onMixReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mixerRef = useRef<AudioMixer | null>(null);
  const animRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingStems, setLoadingStems] = useState(false);

  const readySlots = slots.filter((s) => s.status === "succeeded" && s.stemUrls);

  useEffect(() => {
    if (typeof window === "undefined") return;
    mixerRef.current = new AudioMixer();
    return () => {
      cancelAnimationFrame(animRef.current);
      mixerRef.current?.dispose();
    };
  }, []);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const mixer = mixerRef.current;
    if (!canvas || !mixer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = mixer.getAnalyserData();
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const sliceWidth = W / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * H) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    animRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  async function loadAndPlay() {
    const mixer = mixerRef.current;
    if (!mixer || !readySlots.length) return;

    setLoadingStems(true);
    try {
      await Promise.all(
        readySlots.map((slot) => {
          const url = slot.stemUrls![slot.stemType];
          return mixer.loadStem(slot.id, url, slot.stemType);
        })
      );
    } catch {
      setLoadingStems(false);
      return;
    }
    setLoadingStems(false);
    mixer.play();
    setIsPlaying(true);
    drawWaveform();
  }

  function stopPlay() {
    mixerRef.current?.stop();
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
  }

  async function recordMix() {
    const mixer = mixerRef.current;
    if (!mixer) return;
    setIsRecording(true);
    mixer.startRecording();
    mixer.play();
    setIsPlaying(true);
    drawWaveform();

    // Record for 30 seconds (matching preview length)
    await new Promise((r) => setTimeout(r, 30000));
    const blob = await mixer.stopRecording();
    mixer.stop();
    setIsPlaying(false);
    setIsRecording(false);
    cancelAnimationFrame(animRef.current);
    onMixReady(blob);
  }

  const canMix = readySlots.length >= 2;

  return (
    <div className="bg-gray-800/60 border border-white/10 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-3">Mixer</h3>

      <canvas
        ref={canvasRef}
        width={600}
        height={80}
        className="w-full rounded bg-black/40 border border-white/5"
      />

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        {!isPlaying ? (
          <button
            onClick={loadAndPlay}
            disabled={!canMix || loadingStems}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loadingStems ? (
              <>
                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Loading…
              </>
            ) : (
              "▶ Preview Mix"
            )}
          </button>
        ) : (
          <button
            onClick={stopPlay}
            className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            ■ Stop
          </button>
        )}

        <button
          onClick={recordMix}
          disabled={!canMix || isRecording}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Recording 30s…
            </>
          ) : (
            "⏺ Record & Publish"
          )}
        </button>

        {!canMix && (
          <p className="text-xs text-gray-400">Add at least 2 tracks to mix</p>
        )}
      </div>
    </div>
  );
}
