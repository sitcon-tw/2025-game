"use client";

import { PlayerData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import useToken from "./useToken";

export default function usePlayerData() {
  const token = useToken();

  const {
    data: playerData,
    isLoading,
    isError,
    error,
  } = useQuery<PlayerData, Error>({
    queryKey: ["player-data"],
    queryFn: async () => {
      const response = await fetch("/api/player/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: PlayerData = await response.json();
      return data;
    },
  });

  return { playerData, isLoading, isError, error };
}
