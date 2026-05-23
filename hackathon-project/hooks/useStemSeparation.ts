import { useQuery, useMutation } from "@tanstack/react-query";
import { StemSeparationStatus, StemUrls } from "@/types/stems";

type SeparateResult = { predictionId: string; status: string };

export function useStemSeparate() {
  return useMutation<SeparateResult, Error, { previewUrl: string; trackId: string }>({
    mutationFn: async ({ previewUrl, trackId }) => {
      const res = await fetch("/api/stems/separate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previewUrl, trackId }),
      });
      if (!res.ok) throw new Error("Failed to start stem separation");
      return res.json();
    },
  });
}

type StatusResult = {
  status: StemSeparationStatus;
  stems?: StemUrls;
  error?: string;
};

export function useStemStatus(predictionId: string | null) {
  return useQuery<StatusResult>({
    queryKey: ["stem-status", predictionId],
    queryFn: async () => {
      const res = await fetch(`/api/stems/status?predictionId=${predictionId}`);
      if (!res.ok) throw new Error("Failed to get status");
      return res.json();
    },
    enabled: !!predictionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "succeeded" || status === "failed" || status === "canceled") return false;
      return 4000;
    },
  });
}
