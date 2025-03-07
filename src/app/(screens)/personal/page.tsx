"use client";

import { QrCode, Trophy, Users } from "lucide-react";
import { useQRCode } from "next-qrcode";
import { Button } from "@/components/ui/button";
import usePlayerData from "@/hooks/usePlayerData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function PersonalPage() {
  const { Canvas } = useQRCode();
  const { playerData, isError, isLoading } = usePlayerData();

  const stage = playerData?.stage ?? 1;
  const level = Math.max(1, Math.sqrt(stage) | 0);

  return (
    <div className="mx-auto space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-br from-gray-800 to-purple-950 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <span className="text-xl font-bold">
                {playerData?.name
                  ? playerData.name.charAt(0).toUpperCase()
                  : "?"}
              </span>
            </div>
            <div className="flex-1">
              {playerData?.name ? (
                <h2 className="text-xl font-bold">
                  {playerData.name}{" "}
                  <span className="ml-1 text-sm text-blue-300">Lv.{level}</span>
                </h2>
              ) : (
                <Skeleton className="h-7 w-32 bg-white/30" />
              )}
              <p className="mt-1 text-sm text-white/70">探險者</p>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x border-t border-gray-500">
            <div className="border-gray-500 p-4 text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Trophy size={16} className="text-amber-300" />
                <span className="text-sm font-medium text-gray-300">
                  個人排名
                </span>
              </div>
              <p className="text-lg font-bold text-white">
                1000<span className="text-xs text-gray-300"> / 2000</span>
              </p>
            </div>
            <div className="border-gray-500 p-4 text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Users size={16} className="text-purple-300" />
                <span className="text-sm font-medium text-gray-300">
                  團體排名
                </span>
              </div>
              <p className="text-lg font-bold text-white">
                10<span className="text-xs text-gray-300"> / 99</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Card */}
      <Card className="!mt-0 gap-3 border-0 border-t border-t-gray-500 pt-4 shadow-md">
        {/* <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-white" />
            <h3 className="font-semibold text-white">玩家連結</h3>
          </div>
        </CardHeader> */}
        <CardContent className="mt-3 flex flex-col items-center gap-3">
          <Badge
            variant="outline"
            className="mb-4 border-0 bg-white/10 p-1 px-3 font-normal text-white"
          >
            給攤位掃描 QR Code 即可獲得板塊
          </Badge>
          <div className="mb-6 rounded-xl bg-[#2e344c] p-2 shadow-inner">
            {playerData?.token ? (
              <Canvas
                text={playerData.token}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 4,
                  width: 180,
                  color: {
                    dark: "#fff",
                    light: "#2e344c",
                  },
                }}
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center">
                <Skeleton className="h-full w-full bg-gray-300" />
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-700 p-5 text-sm">
            <p className="mb-3 text-center font-medium italic text-gray-200">
              — 逃逸路線：一則關於探險者的故事 —
            </p>
            <p className="leading-relaxed text-gray-400">
              在這個充滿謎團的世界裡，每位探險者都有自己獨特的路徑。當你站在迷宮的入口，手持各種形狀的板塊，眼前是無數可能。有時，你會遇到無法跨越的障礙；有時，你需要炸開道路；還有時候，你得建立傳送門，跳躍至另一個空間。
            </p>
            <p className="mt-2 leading-relaxed text-gray-400">
              但最奇妙的是，當探險者們相遇，交換彼此的板塊時，原本不可能的路徑突然變得清晰可見。也許，真正的逃逸路線，不僅在於你獨自的探索，更在於與他人相遇時迸發的火花。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
