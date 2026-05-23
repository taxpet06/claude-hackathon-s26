import { useQuery } from "@tanstack/react-query";
import { SpotifyRegionResponse } from "@/types/spotify";

export function useSpotifyRegion(regionId: string | null) {
  return useQuery<SpotifyRegionResponse>({
    queryKey: ["spotify-region", regionId],
    queryFn: async () => {
      const res = await fetch(`/api/spotify/region?regionId=${regionId}`);
      if (!res.ok) throw new Error("Failed to fetch region tracks");
      return res.json();
    },
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5,
  });
}
