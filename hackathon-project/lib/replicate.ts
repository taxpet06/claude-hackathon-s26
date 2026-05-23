import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function startStemSeparation(audioUrl: string): Promise<string> {
  const prediction = await replicate.predictions.create({
    version: "d8f710e2442b0b46bb0b0c685f2c7f1e7c31d20a0a7e70e93f2e1f1b0f9c07f",
    model: "adirik/demucs",
    input: { audio: audioUrl },
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
        drums: output.drums ?? output[0] ?? "",
        bass: output.bass ?? output[1] ?? "",
        vocals: output.vocals ?? output[2] ?? "",
        other: output.other ?? output[3] ?? "",
      },
    };
  }

  return {
    status: prediction.status as PredictionResult["status"],
    error: prediction.error as string | undefined,
  };
}
