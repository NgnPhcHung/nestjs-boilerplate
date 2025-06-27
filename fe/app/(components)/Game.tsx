"use client";

import { setupPixi } from "@/game/initGame";
import {
  UPDATE_PLAYER_POSITION_MUTATION,
  USER_JOIN_MUTATION,
} from "@/graphql/mutations/playground";
import { LIST_PLAYER } from "@/graphql/queries/playground";
import {
  USER_JOINED_SUBSCRIPTION,
  USER_MOVE_SUBSCRIPTION,
} from "@/graphql/subscription/playground";
import { getMeClient } from "@/utils/getMeClient";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserPlayground } from "./model/playgroundModel";

interface UserJoinedSubscriptionData {
  userJoined: UserPlayground;
}

export default function Game() {
  const user = getMeClient();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 100, y: 100 });
  const pixiRef = useRef<any>(null);
  const [joinedAppUsers, setJoinedAppUsers] = useState<number[]>([]);
  const { data: dataPlayers, loading: dataPlayersLoading } = useQuery<{
    players: UserPlayground[];
  }>(LIST_PLAYER);

  const [players, setPlayers] = useState<UserPlayground[]>();

  const [userJoinPlayground] = useMutation(USER_JOIN_MUTATION);
  const [updatePlayerPosition] = useMutation(UPDATE_PLAYER_POSITION_MUTATION);

  useSubscription<UserJoinedSubscriptionData>(USER_JOINED_SUBSCRIPTION, {
    onData: ({ data: { data } }) => {
      if (data && data.userJoined) {
        setJoinedAppUsers((prev) => {
          if (!prev.includes(data.userJoined.userId)) {
            return [...prev, data.userJoined.userId];
          }
          return prev;
        });
      }
    },
    onError: (err) => {
      console.error("GraphQL Subscription (User Join) error:", err.message);
    },
  });

  useSubscription(USER_MOVE_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log({ data });

      const movedPlayer = data.data?.userMoved;
      if (movedPlayer) {
        setPlayers((prev) =>
          prev?.map((player) =>
            player.userId === movedPlayer.id
              ? { ...player, position: movedPlayer.position }
              : player,
          ),
        );

        if (movedPlayer.userId === user.userId) {
          playerPosRef.current = {
            x: movedPlayer.position.x,
            y: movedPlayer.position.y,
          };
        }

        pixiRef.current?.updatePlayerPosition(
          movedPlayer.userId,
          movedPlayer.position.x,
          movedPlayer.position.y,
        );
      }
    },
    onError: (err) => {
      console.error("GraphQL Subscription (User Move) error:", err.message);
    },
  });

  useEffect(() => {
    const doJoin = async () => {
      try {
        const res = await userJoinPlayground({
          variables: { userId: user.userId },
        });

        if (res?.data?.userJoinPlayground && !dataPlayersLoading) {
          const joinedUser: UserPlayground = res.data.userJoinPlayground;
          const {
            position: { x, y },
          } = joinedUser;
          pixiRef.current?.updatePlayerPosition(user.userId, x, y);
          if (containerRef.current) {
            const pixiInstance = await setupPixi(
              containerRef.current,
              dataPlayers?.players!,
            );
            pixiRef.current = pixiInstance;
            containerRef.current.focus();
          }
        } else {
          console.warn("User join mutation returned no data");
        }
      } catch (err) {
        console.error("User join mutation error:", err);
      }
    };
    if (!containerRef.current) return;

    doJoin();
  }, [user.userId, userJoinPlayground, dataPlayersLoading, joinedAppUsers]);

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
  }, []);

  useEffect(() => {
    if (dataPlayers?.players) {
      const foundMe = dataPlayers.players.find((p) => p.userId === user.userId);
      if (foundMe) {
        playerPosRef.current = {
          x: foundMe.position.x,
          y: foundMe.position.y,
        };
      }
      setPlayers(dataPlayers.players);
    }
  }, [dataPlayers?.players]);

  const move = useCallback(
    (x: number, y: number) => {
      const gameSpace = document.getElementById("game-space");

      const currentPos = playerPosRef.current;
      let dx = currentPos.x + x;
      let dy = currentPos.y + y;

      if (
        gameSpace &&
        dx > 0 &&
        dx < gameSpace.clientWidth &&
        dy > 0 &&
        dy < gameSpace.clientHeight
      ) {
        updatePlayerPosition({
          variables: {
            userId: user.userId,
            x: dx,
            y: dy,
          },
        });
        playerPosRef.current = { x: dx, y: dy };

        pixiRef.current?.updatePlayerPosition(user.userId, dx, dy);
      }
    },
    [players],
  );

  return (
    <div
      tabIndex={0}
      ref={containerRef}
      className="w-[calc(100vw-6rem)] h-[calc(100vh-4rem)] rounded-2xl ring-offset-0 ring-0 outline-0"
      id="game-container"
    />
  );
}
