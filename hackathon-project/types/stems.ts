export type StemType = "drums" | "bass" | "vocals" | "other";

export type StemSeparationStatus = "idle" | "starting" | "processing" | "succeeded" | "failed" | "canceled";

export type StemUrls = {
  drums: string;
  bass: string;
  vocals: string;
  other: string;
};

export type StemSlot = {
  id: string;
  trackId: string;
  trackName: string;
  artistName: string;
  previewUrl: string;
  stemType: StemType;
  predictionId: string | null;
  status: StemSeparationStatus;
  stemUrls: StemUrls | null;
  audioBuffer: AudioBuffer | null;
};
