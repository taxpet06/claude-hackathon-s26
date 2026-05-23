export type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl: string | null;
  popularity: number;
  spotifyUrl: string;
};

export type SpotifyRegionResponse = {
  region: { id: string; name: string; coords: [number, number] };
  tracks: SpotifyTrack[];
};

export type SpotifySearchResponse = {
  query: string;
  tracks: SpotifyTrack[];
};
