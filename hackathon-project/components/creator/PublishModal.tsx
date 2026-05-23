"use client";

import { useState } from "react";
import { StemSlot } from "@/types/stems";

type Props = {
  mixBlob: Blob;
  slots: StemSlot[];
  onClose: () => void;
  onPublished: () => void;
};

export default function PublishModal({ mixBlob, slots, onClose, onPublished }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateDescription() {
    if (!title) return;
    setLoadingDesc(true);
    try {
      const stemsUsed = slots
        .filter((s) => s.status === "succeeded")
        .map((s) => ({ stem: s.stemType, fromTrack: s.trackName, fromArtist: s.artistName }));
      const res = await fetch("/api/claude/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stemsUsed, userTitle: title }),
      });
      const data = await res.json();
      setDescription(data.description ?? "");
    } finally {
      setLoadingDesc(false);
    }
  }

  async function publish() {
    if (!title) { setError("Title is required"); return; }
    setPublishing(true);
    setError(null);

    try {
      // Upload audio file to local storage
      const formData = new FormData();
      const filename = `${title.replace(/\s+/g, "-").toLowerCase()}.webm`;
      formData.append("file", new File([mixBlob], filename, { type: "audio/webm" }));

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url: audioUrl } = await uploadRes.json();

      const stemsUsed = slots
        .filter((s) => s.status === "succeeded")
        .map((s) => ({ stem: s.stemType, fromTrack: s.trackName, fromArtist: s.artistName }));

      const res = await fetch("/api/community/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          creatorName: creatorName || "Anonymous",
          audioUrl,
          stemsUsed,
        }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      onPublished();
    } catch (e: any) {
      setError(e.message ?? "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Publish to Community</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Song title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Afrobeats Mashup"
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">Description</label>
              <button
                onClick={generateDescription}
                disabled={!title || loadingDesc}
                className="text-xs text-purple-400 hover:text-purple-300 disabled:opacity-40"
              >
                {loadingDesc ? "Generating…" : "✨ AI Generate"}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your creation…"
              rows={3}
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Your name (optional)</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Anonymous"
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="bg-gray-800/60 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1.5">Stems used:</p>
            {slots.filter((s) => s.status === "succeeded").map((s) => (
              <div key={s.id} className="text-xs text-gray-300">
                <span className="text-white capitalize">{s.stemType}</span> from "{s.trackName}"
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={publish}
            disabled={publishing || !title}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            {publishing ? "Publishing…" : "Publish Song"}
          </button>
        </div>
      </div>
    </div>
  );
}
