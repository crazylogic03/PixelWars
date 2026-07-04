import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboard } from "../services/api";
import { getSocket } from "../services/socket";
import type { LeaderboardEntry } from "../types";

export function useLeaderboard(hasJoined: boolean) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    enabled: hasJoined,
    staleTime: 10000,
  });

  useEffect(() => {
    if (!hasJoined) return;

    const socket = getSocket();

    const handleUpdate = (leaderboard: LeaderboardEntry[]) => {
      queryClient.setQueryData(["leaderboard"], leaderboard);
    };

    socket.on("leaderboardUpdate", handleUpdate);

    return () => {
      socket.off("leaderboardUpdate", handleUpdate);
    };
  }, [hasJoined, queryClient]);

  return {
    leaderboard: data ?? [],
    isLoading,
  };
}
