import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// ryan5453/demucs — verified model on Replicate
const DEMUCS_VERSION = "5a7041cc9b82e5a558fea6b3d7b12dea89625e89da33f0447bd727c2d0ab9e77";

export async function startStemSeparation(audioUrl: string): Promise<string> {
  // Fetch the audio server-side and upload to Replicate directly.
  // iTunes preview URLs are geo-blocked so Replicate can't fetch them directly.
  const audioRes = await fetch(audioUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!audioRes.ok) throw new Error(`Failed to fetch audio: ${audioRes.status}`);

  const audioBuffer = await audioRes.arrayBuffer();
  const audioBlob = new Blob([audioBuffer], { type: audioRes.headers.get("content-type") ?? "audio/mp4" });

  const prediction = await replicate.predictions.create({
    version: DEMUCS_VERSION,
    input: {
      audio: audioBlob,
      model: "htdemucs",
      stem: "none",
      output_format: "mp3",
    },
  });
  return prediction.id;
}

export type StemOutput = {
  drums: string;
  bass: string;
  vocals: string;
  other: string;
};

export type PredictionResult = {
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  stems?: StemOutput;
  error?: string;
};

export async function getPredictionStatus(predictionId: string): Promise<PredictionResult> {
  const prediction = await replicate.predictions.get(predictionId);

  if (prediction.status === "succeeded" && prediction.output) {
    const output = prediction.output as any;
    return {
      status: "succeeded",
      stems: {
        drums: output.drums ?? "",
        bass: output.bass ?? "",
        vocals: output.vocals ?? "",
        other: output.other ?? "",
      },
    };
  }

  return {
    status: prediction.status as PredictionResult["status"],
    error: typeof prediction.error === "string" ? prediction.error : undefined,
  };
}
