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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import achievementsConfig from "@/config/achievements.json";
import { sha256 } from "js-sha256";

export default function Page() {
  // const [playerToken, setPlayerToken] = useState<string | null>(null);
  const token = useToken() ?? "";
  // const [boothName, setBoothName] = useState<string | null>(null);

  const tokenSha256 = sha256(token);

  const achievementId = Object.keys(achievementsConfig).find((achievement) =>
    achievementsConfig[
      achievement as keyof typeof achievementsConfig
    ].scanners.includes(tokenSha256),
  ) as keyof typeof achievementsConfig;
  const achievement = achievementsConfig[achievementId];

  const role = achievement?.scanner_name;
  const actionName = `你可以給予會眾「${achievement?.name}」成就`;

  const displayName = role ? `你是 ${role} :D` : "（無法辨識 Token）";

  const queryClient = useQueryClient();

  const achievementMutation = useMutation({
    mutationFn: async (playerToken: string) => {
      if (typeof playerToken !== "string") return;

      return await fetch(`/api/achievement`, {
        method: "POST",
        body: JSON.stringify({
          scannerToken: token,
          achievementId: achievementId,
          token: playerToken,
        }),
      });
    },
    onSuccess: (response) => {
      if (response?.status === 200) {
        toast("已為會眾增加成就", { type: "success" });
        queryClient.invalidateQueries({
          queryKey: ["achievements", token],
        });
      } else {
        toast("增加成就失敗", { type: "error" });
      }
    },
  });

  // const handleResult = async (playerToken: string) => {
  //   if (typeof playerToken !== "string") return;
  //   const result = await sendPuzzle2Player(playerToken, token);
  //   const playerInfo = await getPlayerPuzzle(playerToken);
  //   // setPlayerToken(null);
  //   if (result === puzzleSuccess) {
  //     toast(`已為 ${playerInfo.user_id} 增加板塊`, { type: "success" });
  //   } else if (result === puzzleTaken) {
  //     toast(`${playerInfo.user_id} 已存在這張板塊`, { type: "warning" });
  //   } else if (result === invalidToken) {
  //     toast(`${playerInfo.user_id} 尚未報到`, {
  //       type: "error",
  //     });
  //   }
  // };

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
        <h1 className="my-2 mt-4 text-center text-xl tracking-wider opacity-75">
          成就掃描器
        </h1>
        <h1 className="text-center text-2xl font-bold">{displayName}</h1>
        <h1 className="my-2 text-center text-xl tracking-wider opacity-75">
          {actionName}
        </h1>
        <div className="my-4 flex w-full items-center justify-center gap-6 rounded-2xl bg-gray-50 p-2 text-center shadow">
          <div className="aspect-square w-full overflow-hidden rounded-xl">
            <QrCodeScanner
              qrCodeSuccessCallback={(result) => {
                achievementMutation.mutate(result);
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
