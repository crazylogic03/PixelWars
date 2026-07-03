// ─── Data Models ───────────────────────────────────────────────

export interface CellData {
  id: string;
  row: number;
  column: number;
  ownerId: string | null;
  ownerColor: string | null;
  ownerUsername: string | null;
  capturedAt: string | null;
}

export interface UserData {
  id: string;
  username: string;
  color: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  color: string;
  tileCount: number;
}

export interface StatsData {
  totalTiles: number;
  capturedTiles: number;
  remainingTiles: number;
  onlineUsers: number;
}

export interface ActivityEntry {
  username: string;
  color: string;
  row: number;
  column: number;
  timestamp: string;
}

// ─── API Types ─────────────────────────────────────────────────

export interface CaptureRequest {
  row: number;
  column: number;
  userId: string;
}

export interface CaptureResponse {
  success: boolean;
  cell?: CellData;
  message: string;
}

export interface GridResponse {
  cells: CellData[];
  gridSize: number;
}

// ─── Socket Event Types ────────────────────────────────────────

export interface ClientToServerEvents {
  join: (data: UserData) => void;
  captureTile: (data: CaptureRequest, callback: (response: CaptureResponse) => void) => void;
  disconnect: () => void;
}

export interface ServerToClientEvents {
  tileCaptured: (data: { cell: CellData; activity: ActivityEntry }) => void;
  leaderboardUpdate: (data: LeaderboardEntry[]) => void;
  userJoined: (data: { user: UserData; onlineUsers: UserData[] }) => void;
  userLeft: (data: { userId: string; onlineUsers: UserData[] }) => void;
  statsUpdated: (data: StatsData) => void;
  cooldownError: (data: { message: string; remainingMs: number }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: UserData;
}
