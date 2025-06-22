"use client";

import { setupPixi } from "@/game/initGame";
import { randomUserAva } from "@/game/loadAvata";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

type Player = {
  x: number;
  y: number;
};

export default function Game() {
  const [myId, setMyId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 190, y: 190 });

  const pixiRef = useRef<any>(null);
  useEffect(() => {
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      setMyId(socket.id || null);
    });

    socket.on("init", async (players: Record<string, Player>) => {
      const entries = await Promise.all(
        Object.keys(players).map(async (id) => [
          id,
          (await randomUserAva()).src,
        ]),
      );
      const avatars = Object.fromEntries(entries);

      if (!containerRef.current) return;
      socket.on("moved", ({ id, x, y }) => {
        pixiRef.current?.updatePlayerPosition(id, x, y);
      });
      if (containerRef.current) {
        const pixiInstance = await setupPixi(
          containerRef.current,
          players,
          avatars,
        );
        pixiRef.current = pixiInstance;
        containerRef.current.focus();
      }

      socket.on("player_left", (id: string) => {
        pixiRef.current?.removePlayer(id);
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (["arrowup", "w"].includes(key)) move(0, -10);
      else if (["arrowdown", "s"].includes(key)) move(0, 10);
      else if (["arrowleft", "a"].includes(key)) move(-10, 0);
      else if (["arrowright", "d"].includes(key)) move(10, 0);
    };

    el.addEventListener("keydown", handleKey);

    return () => {
      el.removeEventListener("keydown", handleKey);
    };
  }, [myId]);

  const move = (dx: number, dy: number) => {
    const id = myId;
    const socket = socketRef.current;
    if (!id || !socket) return;

    const gameSpace = document.getElementById("game-space");

    const current = playerPosRef.current;

    const next = { x: current.x + dx, y: current.y + dy };

    if (
      gameSpace &&
      next.x > 0 &&
      next.x < gameSpace.clientWidth &&
      next.y > 0 &&
      next.y < gameSpace.clientHeight
    ) {
      playerPosRef.current = next;
      socket.emit("move", next);
      pixiRef.current?.updatePlayerPosition(id, next.x, next.y);
    }
  };

  return (
    <div
      tabIndex={0}
      ref={containerRef}
      className="w-[calc(100vw-6rem)] h-[calc(100vh-4rem)] rounded-2xl ring-offset-0 ring-0 outline-0"
      id="game-container"
    />
  );
}
