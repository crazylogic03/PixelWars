import { useEffect, useState, useRef, useCallback } from "react";
import { getSocket, disconnectSocket, type TypedSocket } from "../services/socket";
import type { UserData } from "../types";

export function useSocket(user: UserData | null, hasJoined: boolean) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([]);
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    if (!user || !hasJoined) return;

    const socket = getSocket();
    socketRef.current = socket;

    function onConnect() {
      setIsConnected(true);
      // Emit join with user data
      socket.emit("join", user!);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("userJoined", (data) => {
      setOnlineUsers(data.onlineUsers);
    });

    socket.on("userLeft", (data) => {
      setOnlineUsers(data.onlineUsers);
    });

    // Connect
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("userJoined");
      socket.off("userLeft");
      disconnectSocket();
    };
  }, [user, hasJoined]);

  const getSocketInstance = useCallback(() => {
    return socketRef.current;
  }, []);

  return { isConnected, onlineUsers, getSocketInstance };
}
