import { useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGrid } from "../services/api";
import { getSocket } from "../services/socket";
import type { CellData, CaptureResponse, ActivityEntry } from "../types";
import toast from "react-hot-toast";

const GRID_SIZE = 40;

export function useGrid(hasJoined: boolean) {
  const queryClient = useQueryClient();
  const activitiesRef = useRef<ActivityEntry[]>([]);
  const activityListenersRef = useRef<Set<(activities: ActivityEntry[]) => void>>(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ["grid"],
    queryFn: fetchGrid,
    enabled: hasJoined,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Listen for real-time tile captures
  useEffect(() => {
    if (!hasJoined) return;

    const socket = getSocket();

    const handleTileCaptured = (eventData: { cell: CellData; activity: ActivityEntry }) => {
      // Update the grid cache
      queryClient.setQueryData(["grid"], (old: typeof data) => {
        if (!old) return old;
        return {
          ...old,
          cells: old.cells.map((cell: CellData) =>
            cell.row === eventData.cell.row && cell.column === eventData.cell.column
              ? eventData.cell
              : cell
          ),
        };
      });

      // Track activity
      activitiesRef.current = [eventData.activity, ...activitiesRef.current].slice(0, 20);
      activityListenersRef.current.forEach((listener) =>
        listener([...activitiesRef.current])
      );
    };

    socket.on("tileCaptured", handleTileCaptured);

    return () => {
      socket.off("tileCaptured", handleTileCaptured);
    };
  }, [hasJoined, queryClient, data]);

  const captureTile = useCallback(
    (row: number, column: number, userId: string): Promise<CaptureResponse> => {
      return new Promise((resolve) => {
        const socket = getSocket();
        socket.emit("captureTile", { row, column, userId }, (response: CaptureResponse) => {
          if (response.success) {
            toast.success("Tile captured! ⚔️", {
              style: {
                background: "#1E293B",
                color: "#F8FAFC",
                border: "1px solid #334155",
              },
              iconTheme: { primary: "#22C55E", secondary: "#F8FAFC" },
            });
          } else {
            toast.error(response.message, {
              style: {
                background: "#1E293B",
                color: "#F8FAFC",
                border: "1px solid #334155",
              },
              iconTheme: { primary: "#EF4444", secondary: "#F8FAFC" },
            });
          }
          resolve(response);
        });
      });
    },
    []
  );

  // Build grid as 2D array for efficient territory detection
  const gridMap = useCallback((): Map<string, CellData> => {
    if (!data?.cells) return new Map();
    const map = new Map<string, CellData>();
    for (const cell of data.cells) {
      map.set(`${cell.row}-${cell.column}`, cell);
    }
    return map;
  }, [data]);

  const subscribeToActivities = useCallback(
    (listener: (activities: ActivityEntry[]) => void) => {
      activityListenersRef.current.add(listener);
      // Send current activities immediately
      listener([...activitiesRef.current]);
      return () => {
        activityListenersRef.current.delete(listener);
      };
    },
    []
  );

  return {
    cells: data?.cells ?? [],
    gridSize: data?.gridSize ?? GRID_SIZE,
    isLoading,
    error,
    captureTile,
    gridMap,
    subscribeToActivities,
  };
}
