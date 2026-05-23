export type StemUsed = {
  stem: string;
  fromTrack: string;
  fromArtist: string;
};

export type CommunitySong = {
  id: string;
  title: string;
  description: string | null;
  creator_name: string;
  audio_url: string;
  stems_used: StemUsed[];
  play_count: number;
  created_at: string;
};

export type CreateSongPayload = {
  title: string;
  description: string;
  creatorName: string;
  audioUrl: string;
  stemsUsed: StemUsed[];
};
