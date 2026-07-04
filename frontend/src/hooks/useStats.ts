import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStats } from "../services/api";
import { getSocket } from "../services/socket";
import type { StatsData } from "../types";

export function useStats(hasJoined: boolean) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    enabled: hasJoined,
    staleTime: 5000,
  });

  useEffect(() => {
    if (!hasJoined) return;

    const socket = getSocket();

    const handleUpdate = (stats: StatsData) => {
      queryClient.setQueryData(["stats"], stats);
    };

    socket.on("statsUpdated", handleUpdate);

    return () => {
      socket.off("statsUpdated", handleUpdate);
    };
  }, [hasJoined, queryClient]);

  return {
    stats: data ?? {
      totalTiles: 1600,
      capturedTiles: 0,
      remainingTiles: 1600,
      onlineUsers: 0,
    },
    isLoading,
  };
}
