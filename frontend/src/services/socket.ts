import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "../types";

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

let socket: TypedSocket | null = null;

export function getSocket(): TypedSocket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
