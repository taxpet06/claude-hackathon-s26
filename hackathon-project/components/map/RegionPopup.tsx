"use client";

import { useSpotifyRegion } from "@/hooks/useSpotifyRegion";
import { Region } from "@/types/regions";
import TrackList from "@/components/tracks/TrackList";

type Props = { region: Region; onClose: () => void };

export default function RegionPopup({ region, onClose }: Props) {
  const { data, isLoading, isError } = useSpotifyRegion(region.id);

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-gray-900/95 backdrop-blur border border-white/10 rounded-xl overflow-hidden flex flex-col z-20 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: region.pinColor }}
            />
            <h2 className="font-semibold text-white text-sm">{region.name}</h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-5">{region.genre}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {isError && (
          <p className="text-center text-gray-400 text-sm p-6">Failed to load tracks.</p>
        )}
        {data && <TrackList tracks={data.tracks} />}
      </div>
    </div>
  );
}
