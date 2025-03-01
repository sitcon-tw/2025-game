"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import Scanner from "./Scanner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { sendPuzzle2Player } from "@/lib/sendPuzzle2Player";
import { invalidToken, puzzleSuccess, puzzleTaken } from "@/lib/const";
import { getBoothName } from "@/lib/getBoothName";
import { getPlayerPuzzle } from "@/lib/getPlayerPuzzle";
import { QrCode } from "lucide-react";
import QrCodeScanner from "@/components/QrCodeScanner";
import { useQuery } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";

export default function Page() {
  // const [playerToken, setPlayerToken] = useState<string | null>(null);
  const boothToken = useToken() ?? "";
  // const [boothName, setBoothName] = useState<string | null>(null);

  const {
    data: boothName,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["boothName", boothToken],
    queryFn: async () => {
      return (await getBoothName(boothToken))?.slug;
    },
  });

  const boothDisplayName = isLoading
    ? "載入中..."
    : !boothName
      ? "（攤位不存在）"
      : boothName;

  // useEffect(() => {
  const handleResult = async (playerToken: string) => {
    if (typeof window !== "undefined") {
      // const boothToken = new URLSearchParams(window.location.search).get(
      //   "token",
      // )!;
      // setBoothToken(boothToken);
      // if (boothName === null) {
      //   const boothName = (await getBoothName(boothToken))?.slug;
      //   setBoothName(boothName ? boothName : "（攤位不存在）");
      // }
    }
    if (typeof playerToken !== "string") return;
    const result = await sendPuzzle2Player(playerToken, boothToken);
    const playerInfo = await getPlayerPuzzle(playerToken);
    // setPlayerToken(null);
    if (result === puzzleSuccess) {
      toast(`已為 ${playerInfo.user_id} 增加拼圖`, { type: "success" });
    } else if (result === puzzleTaken) {
      toast(`${playerInfo.user_id} 已存在這張拼圖`, { type: "warning" });
    } else if (result === invalidToken) {
      toast(`${playerInfo.user_id} 尚未報到`, {
        type: "error",
      });
    }
  };
  // handleResult();
  // console.log("boothName", boothName);
  // console.log("boothToken", boothToken);
  // console.log("playerToken", playerToken);
  // }, [boothName, boothToken, playerToken]);
  return (
    <div>
      <motion.div
        className="mx-auto w-full max-w-[512px] px-2 py-10 text-foreground"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5 }}
      >
        <QrCode size={32} className="m-auto" />
        <h1 className="mt-2 text-center text-xl tracking-wider opacity-75">
          攤位掃描器
        </h1>
        <h1 className="text-center text-2xl font-bold">{boothDisplayName}</h1>
        <div className="my-4 flex w-full items-center justify-center gap-6 rounded-2xl bg-gray-50 p-2 text-center shadow">
          <div className="aspect-square w-full overflow-hidden rounded-xl">
            <QrCodeScanner
              qrCodeSuccessCallback={(result) => {
                handleResult(result);
                // setPlayerToken(result);
              }}
            />
          </div>
        </div>
        <div className="text-center text-xl text-gray-200">
          請掃描會眾 OPass 中的 QR code
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}

async function sendPuzzle2Player(playerToken: string, boothToken: string) {
  const body = new FormData();
  body.append("receiver", playerToken);

  return fetch(`/api/player/deliver`, {
    method: "POST",
    body: JSON.stringify({ boothToken, playerToken }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 400) return res.text();
      return res.json();
    })
    .catch((err) => {
      return err;
    });
}
