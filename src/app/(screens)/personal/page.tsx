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

  return (
    <div className="container py-8 max-w-md mx-auto space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-br from-primary to-purple-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <span className="font-bold text-xl">
                {playerData?.name ? playerData.name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <div className="flex-1">
              {playerData?.name ? (
                <h2 className="text-xl font-bold">{playerData.name}</h2>
              ) : (
                <Skeleton className="h-7 w-32 bg-white/30" />
              )}
              <p className="text-white/70 text-sm mt-1">探險者</p>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x divide-border border-t">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">個人排名</span>
              </div>
              <p className="font-bold text-lg">
                1000<span className="text-xs text-muted-foreground">/2000</span>
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={16} className="text-indigo-500" />
                <span className="text-sm font-medium text-muted-foreground">團體排名</span>
              </div>
              <p className="font-bold text-lg">
                10<span className="text-xs text-muted-foreground">/99</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Card */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <QrCode className="text-primary h-5 w-5" />
            <h3 className="font-semibold">玩家連結</h3>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-0">
            掃描 QR Code 與其他玩家交換板塊
          </Badge>

          <div className="rounded-xl bg-white p-4 shadow-inner mb-6">
            <Canvas
              text={playerData?.token ?? "null"}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 180,
                color: {
                  dark: "#7c3aed",
                  light: "#FFFFFF",
                },
              }}
            />
          </div>

          <div className="bg-muted/30 rounded-lg p-5 text-sm">
            <p className="text-center text-muted-foreground mb-3 font-medium italic">
              — 逃逸路線：一則關於探險者的故事 —
            </p>
            <p className="leading-relaxed text-muted-foreground">
              在這個充滿謎團的世界裡，每位探險者都有自己獨特的路徑。當你站在迷宮的入口，手持各種形狀的板塊，眼前是無數可能。有時，你會遇到無法跨越的障礙；有時，你需要炸開道路；還有時候，你得建立傳送門，跳躍至另一個空間。
            </p>
            <p className="leading-relaxed mt-2 text-muted-foreground">
              但最奇妙的是，當探險者們相遇，交換彼此的板塊時，原本不可能的路徑突然變得清晰可見。也許，真正的逃逸路線，不僅在於你獨自的探索，更在於與他人相遇時迸發的火花。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
