import { motion } from "motion/react";
import type { StatsData } from "../../types";

interface StatsProps {
  stats: StatsData;
  userTileCount: number;
}

export default function Stats({ stats, userTileCount }: StatsProps) {
  const progressPercent = stats.totalTiles > 0
    ? Math.round((stats.capturedTiles / stats.totalTiles) * 100)
    : 0;

  return (
    <div className="card p-[22px]">
      {/* Header */}
      <div className="section-header">
        <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span>Battlefield Stats</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-y-5">
        {/* Total Tiles */}
        <div className="pr-5 border-r border-[var(--color-border-light)]">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
            <span className="text-xs text-[var(--color-text-secondary)]">Total Tiles</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 stat-value">
            {stats.totalTiles.toLocaleString()}
          </p>
        </div>

        {/* Captured */}
        <div className="pl-5">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-[var(--color-text-secondary)]">Captured</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 stat-value">
            {stats.capturedTiles.toLocaleString()}
          </p>
        </div>

        {/* Remaining */}
        <div className="pr-5 border-r border-[var(--color-border-light)]">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs text-[var(--color-text-secondary)]">Remaining</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 stat-value">
            {stats.remainingTiles.toLocaleString()}
          </p>
        </div>

        {/* Your Tiles */}
        <div className="pl-5">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-[var(--color-text-secondary)]">Your Tiles</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 stat-value">
            {userTileCount}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--color-text-secondary)] font-medium">Territory Claimed</span>
          <span className="text-[var(--color-accent)] font-semibold">{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-[#EEF2F7] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--color-accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
