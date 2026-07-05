import { motion } from "motion/react";

interface CooldownProps {
  isCoolingDown: boolean;
  remainingMs: number;
  progress: number;
}

export default function Cooldown({
  isCoolingDown,
  remainingMs,
  progress,
}: CooldownProps) {
  const seconds = (remainingMs / 1000).toFixed(1);
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference * progress;

  return (
    <div className="card p-[22px]">
      {/* Header */}
      <div className="section-header">
        <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Cooldown</span>
      </div>

      {!isCoolingDown ? (
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full border-[3px] border-[var(--color-success)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ready to capture!
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            You can capture another tile in
          </p>

          <div className="flex justify-center">
            <div className="relative w-[100px] h-[100px]">
              {/* Background Circle */}
              <svg className="cooldown-circle w-full h-full" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="28"
                  fill="none"
                  stroke="var(--color-border-light)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="30"
                  cy="30"
                  r="28"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[var(--color-text-primary)] stat-value">
                  {seconds}s
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
