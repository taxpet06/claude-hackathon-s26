import { useQuery } from "@tanstack/react-query";
import { CommunitySong } from "@/types/community";

type FeedResult = { songs: CommunitySong[]; total: number; page: number };

export function useCommunityFeed(page = 1) {
  return useQuery<FeedResult>({
    queryKey: ["community-feed", page],
    queryFn: async () => {
      const res = await fetch(`/api/community/songs?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch community songs");
      return res.json();
    },
    staleTime: 1000 * 30,
  });
}
