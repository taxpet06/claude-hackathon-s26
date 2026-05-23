import { SpotifyTrack } from "@/types/spotify";
import TrackCard from "./TrackCard";

type Props = {
  tracks: SpotifyTrack[];
  action?: { label: string; onClick: (track: SpotifyTrack) => void; requiresPreview?: boolean };
};

export default function TrackList({ tracks, action }: Props) {
  if (!tracks.length) {
    return <p className="text-center text-gray-400 text-sm p-6">No tracks found.</p>;
  }

  return (
    <div className="divide-y divide-white/5">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} action={action} />
      ))}
    </div>
  );
}
