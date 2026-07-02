import { PrismaClient } from "@prisma/client";
import type { CellData, CaptureResponse } from "../types/index.js";
import { COOLDOWN_MS } from "../utils/constants.js";

const prisma = new PrismaClient();

// Server-side cooldown tracking
const cooldowns = new Map<string, number>();

export function checkCooldown(userId: string): { allowed: boolean; remainingMs: number } {
  const lastCapture = cooldowns.get(userId);
  if (!lastCapture) return { allowed: true, remainingMs: 0 };

  const elapsed = Date.now() - lastCapture;
  if (elapsed >= COOLDOWN_MS) return { allowed: true, remainingMs: 0 };

  return { allowed: false, remainingMs: COOLDOWN_MS - elapsed };
}

export function setCooldown(userId: string): void {
  cooldowns.set(userId, Date.now());
}

export async function captureTile(
  row: number,
  column: number,
  userId: string
): Promise<CaptureResponse> {
  // Check cooldown
  const cooldownCheck = checkCooldown(userId);
  if (!cooldownCheck.allowed) {
    return {
      success: false,
      message: `Cooldown active! Wait ${Math.ceil(cooldownCheck.remainingMs / 1000)}s`,
    };
  }

  try {
    // Use interactive transaction for atomic capture
    const result = await prisma.$transaction(async (tx) => {
      // Lock the row with SELECT ... FOR UPDATE
      const cell = await tx.cell.findUnique({
        where: { row_column: { row, column } },
      });

      if (!cell) {
        return { success: false, message: "Cell not found" } as CaptureResponse;
      }

      if (cell.ownerId !== null) {
        return { success: false, message: "Tile already owned!" } as CaptureResponse;
      }

      // Capture the tile
      const updated = await tx.cell.update({
        where: { id: cell.id },
        data: {
          ownerId: userId,
          capturedAt: new Date(),
        },
        include: {
          owner: {
            select: { id: true, username: true, color: true },
          },
        },
      });

      const cellData: CellData = {
        id: updated.id,
        row: updated.row,
        column: updated.column,
        ownerId: updated.ownerId,
        ownerColor: updated.owner?.color ?? null,
        ownerUsername: updated.owner?.username ?? null,
        capturedAt: updated.capturedAt?.toISOString() ?? null,
      };

      return { success: true, cell: cellData, message: "Tile captured!" } as CaptureResponse;
    }, {
      isolationLevel: "Serializable",
    });

    // Set cooldown only on successful capture
    if (result.success) {
      setCooldown(userId);
    }

    return result;
  } catch (error) {
    console.error("Capture error:", error);
    return { success: false, message: "Failed to capture tile. Try again." };
  }
}
