import Stats from "../Stats/Stats";
import Leaderboard from "../Leaderboard/Leaderboard";
import Activity from "../Activity/Activity";
import type { StatsData, LeaderboardEntry, ActivityEntry } from "../../types";

interface SidebarProps {
  stats: StatsData;
  leaderboard: LeaderboardEntry[];
  userTileCount: number;
  currentUserId: string;
  subscribeToActivities: (
    listener: (activities: ActivityEntry[]) => void
  ) => () => void;
}

export default function Sidebar({
  stats,
  leaderboard,
  userTileCount,
  currentUserId,
  subscribeToActivities,
}: SidebarProps) {
  return (
    <aside className="w-[300px] flex-shrink-0 h-full overflow-y-auto space-y-4 bg-[var(--color-bg-sidebar)]">
      <Stats stats={stats} userTileCount={userTileCount} />
      <Leaderboard leaderboard={leaderboard} currentUserId={currentUserId} />
      <Activity subscribeToActivities={subscribeToActivities} />
    </aside>
  );
}
