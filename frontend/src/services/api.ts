import type { GridResponse, LeaderboardEntry, StatsData } from "../types";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE}/api${url}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export function fetchGrid(): Promise<GridResponse> {
  return fetchJSON<GridResponse>("/grid");
}

export function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  return fetchJSON<LeaderboardEntry[]>("/leaderboard");
}

export function fetchStats(): Promise<StatsData> {
  return fetchJSON<StatsData>("/stats");
}