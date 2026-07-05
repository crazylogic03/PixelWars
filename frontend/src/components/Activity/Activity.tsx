import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ActivityEntry } from "../../types";

interface ActivityProps {
  subscribeToActivities: (
    listener: (activities: ActivityEntry[]) => void
  ) => () => void;
}

export default function Activity({ subscribeToActivities }: ActivityProps) {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToActivities((newActivities) => {
      setActivities(newActivities);
    });
    return unsubscribe;
  }, [subscribeToActivities]);

  return (
    <div className="card p-[22px]">
      {/* Header */}
      <div className="section-header">
        <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Recent Activity</span>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-6">
          Waiting for action.
        </p>
      ) : (
        <div className="space-y-1 max-h-44 overflow-y-auto">
          <AnimatePresence mode="popLayout" initial={false}>
            {activities.slice(0, 10).map((activity, index) => (
              <motion.div
                key={`${activity.timestamp}-${activity.row}-${activity.column}`}
                className="flex items-center gap-3 py-1.5 px-1"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Color Dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: activity.color }}
                />

                {/* Activity Text */}
                <span className="text-sm text-[var(--color-text-primary)] truncate">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {activity.username}
                  </span>{" "}
                  captured{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">
                    ({activity.row}, {activity.column})
                  </span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* View All Link */}
      {activities.length > 0 && (
        <div className="view-all-link mt-3">
          View all activity
        </div>
      )}
    </div>
  );
}
