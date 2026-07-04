import React, { memo, useCallback } from "react";
import { motion } from "motion/react";
import type { CellData } from "../../types";

interface TileProps {
  cell: CellData;
  onClick: (row: number, col: number) => void;
  isDisabled: boolean;
  connectedTop: boolean;
  connectedBottom: boolean;
  connectedLeft: boolean;
  connectedRight: boolean;
}

const Tile = memo(function Tile({
  cell,
  onClick,
  isDisabled,
  connectedTop,
  connectedBottom,
  connectedLeft,
  connectedRight,
}: TileProps) {
  const isOwned = cell.ownerId !== null;

  const handleClick = useCallback(() => {
    if (!isDisabled && !isOwned) {
      onClick(cell.row, cell.column);
    }
  }, [cell.row, cell.column, isDisabled, isOwned, onClick]);

  const territoryClasses = isOwned
    ? [
        connectedTop ? "territory-connected-top" : "",
        connectedBottom ? "territory-connected-bottom" : "",
        connectedLeft ? "territory-connected-left" : "",
        connectedRight ? "territory-connected-right" : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  if (isOwned) {
    return (
      <motion.div
        className={`tile ${territoryClasses}`}
        style={{
          backgroundColor: cell.ownerColor || "#3B82F6",
          border: "1px solid rgba(255, 255, 255, 0.78)",
          cursor: "default",
          opacity: 0.72,
        }}
        initial={false}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        title={`${cell.ownerUsername} (${cell.row}, ${cell.column})`}
      />
    );
  }

  return (
    <div
      className="tile tile-empty"
      onClick={handleClick}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
      }}
      title={`Empty (${cell.row}, ${cell.column})`}
    />
  );
});

export default Tile;
