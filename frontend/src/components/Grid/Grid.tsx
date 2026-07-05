import { useMemo, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from "motion/react";
import Tile from "./Tile";
import type { CellData, UserData } from "../../types";

interface GridProps {
  cells: CellData[];
  gridSize: number;
  onCapture: (row: number, col: number) => void;
  isDisabled: boolean;
  user: UserData;
}

export default function Grid({
  cells,
  gridSize,
  onCapture,
  isDisabled,
  user,
}: GridProps) {
  // Build a lookup map for O(1) neighbor checks (territory heatmap)
  const cellMap = useMemo(() => {
    const map = new Map<string, CellData>();
    for (const cell of cells) {
      map.set(`${cell.row}-${cell.column}`, cell);
    }
    return map;
  }, [cells]);

  // Check if a neighbor has the same owner
  const isSameOwner = useCallback(
    (row: number, col: number, ownerId: string | null) => {
      if (!ownerId) return false;
      const neighbor = cellMap.get(`${row}-${col}`);
      return neighbor?.ownerId === ownerId;
    },
    [cellMap]
  );

  const handleTileClick = useCallback(
    (row: number, col: number) => {
      onCapture(row, col);
    },
    [onCapture]
  );

  // Sort cells by row,column for deterministic rendering
  const sortedCells = useMemo(() => {
    return [...cells].sort((a, b) =>
      a.row !== b.row ? a.row - b.row : a.column - b.column
    );
  }, [cells]);

  // Build legend: get unique owners (top 5 by frequency)
  const legend = useMemo(() => {
    const ownerCounts = new Map<string, { username: string; color: string; count: number }>();
    for (const cell of cells) {
      if (cell.ownerId && cell.ownerUsername && cell.ownerColor) {
        const existing = ownerCounts.get(cell.ownerId);
        if (existing) {
          existing.count++;
        } else {
          ownerCounts.set(cell.ownerId, {
            username: cell.ownerUsername,
            color: cell.ownerColor,
            count: 1,
          });
        }
      }
    }
    return Array.from(ownerCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }));
  }, [cells]);

  if (cells.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="text-[var(--color-text-muted)] text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading grid...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="card flex-1 flex flex-col overflow-hidden bg-white">
      <div className="flex-1 relative overflow-hidden">
        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.08 }}
          panning={{ velocityDisabled: true, excluded: ["tile", "tile-empty"] }}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform, instance }) => (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[var(--color-bg-card-hover)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h6M4 12h6M4 17h6M14 7h6M14 12h6M14 17h6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight">
                      Battlefield
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      Click on any empty tile to capture it!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <button
                    onClick={() => zoomOut()}
                    className="card-sm w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors text-2xl leading-none cursor-pointer"
                    aria-label="Zoom out"
                    title="Zoom out"
                  >
                    -
                  </button>
                  <div className="min-w-12 text-center text-base font-semibold text-[var(--color-text-primary)] stat-value">
                    {Math.round((instance?.transformState?.scale ?? 1) * 100)}%
                  </div>
                  <button
                    onClick={() => zoomIn()}
                    className="card-sm w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors text-2xl leading-none cursor-pointer"
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    +
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="card-sm w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors cursor-pointer"
                    aria-label="Reset zoom"
                    title="Reset zoom"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "calc(100% - 73px)",
                }}
                contentStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  className="grid gap-0.5 p-5"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, 18px)`,
                    gridTemplateRows: `repeat(${gridSize}, 18px)`,
                  }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {sortedCells.map((cell) => (
                    <Tile
                      key={`${cell.row}-${cell.column}`}
                      cell={cell}
                      onClick={handleTileClick}
                      isDisabled={isDisabled}
                      connectedTop={isSameOwner(cell.row - 1, cell.column, cell.ownerId)}
                      connectedBottom={isSameOwner(cell.row + 1, cell.column, cell.ownerId)}
                      connectedLeft={isSameOwner(cell.row, cell.column - 1, cell.ownerId)}
                      connectedRight={isSameOwner(cell.row, cell.column + 1, cell.ownerId)}
                    />
                  ))}
                </motion.div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Legend */}
      <div className="mx-5 mb-4 px-6 py-4 border border-[var(--color-border)] rounded-md flex items-center justify-center gap-10 flex-wrap">
        {/* Current User */}
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: user.color }} />
          <span className="font-medium">You</span>
        </div>

        {/* Top Players */}
        {legend
          .filter((l) => l.id !== user.id)
          .slice(0, 4)
          .map((entry) => (
            <div key={entry.id} className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: entry.color }} />
              <span>{entry.username}</span>
            </div>
          ))}

        {/* Unclaimed */}
        <div className="legend-item">
          <div className="legend-dot bg-[var(--color-bg-tile)] border border-[var(--color-border)]" />
          <span>Unclaimed</span>
        </div>
      </div>
    </div>
  );
}
