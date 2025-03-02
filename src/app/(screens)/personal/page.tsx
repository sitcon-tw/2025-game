"use client";

import { SquareUserRound, UserRound } from "lucide-react";
import { useQRCode } from "next-qrcode";
import { Button } from "@/components/ui/button";
import usePlayerData from "@/hooks/usePlayerData";

export default function PersonalPage() {
  const { Canvas } = useQRCode();
  const { playerData, isError, isLoading, error } = usePlayerData();

  return (
    <div className="flex h-full w-full flex-col px-[2rem] pt-[2rem] text-foreground">
      <div className="w-full rounded-lg bg-primary">
        <div className="flex h-full w-full px-[0.75rem] py-[0.5rem]">
          <div className="flex h-full flex-initial">
            <SquareUserRound
              className="m-auto"
              width={"2rem"}
              height={"2rem"}
            />
          </div>
          <div className="flex flex-none flex-col pl-[0.75rem] text-left">
            <div>玩家名稱：</div>
            <div>個人排名：</div>
            <div>團體排名：</div>
          </div>
          <div className="flex-1 flex-col pl-[0.5rem] text-right">
            <div>{playerData?.name}</div>
            <div>1000/2000</div>
            <div>10/99</div>
          </div>
        </div>
      </div>
      <div className="mt-[2rem] h-auto w-full rounded-lg bg-primary text-foreground">
        <div className="flex flex-col gap-4 p-[1rem]">
          <div className="flex items-center">
            <UserRound width={20} height={23} />
            <p>關於我</p>
          </div>
          <div className="mx-auto flex overflow-hidden rounded-lg">
            <Canvas
              text={playerData?.token ?? "null"}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#4B5563FF",
                  light: "#E5E7EBFF",
                },
              }}
            />
          </div>
          <div className="mx-auto flex">
            <p>
              這是一段沒有意義的文字，這只是為了要充滿文字的頁面，讓這個頁面看起來很豐富，你覺得這個頁面怎麼樣呢？
            </p>
          </div>
          {/* <div className="flex pt-[1rem]">
            <Button className="text-md mx-auto bg-purple-500 font-bold">
              分享
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
