"use client";

import { SquareUserRound, UserRound } from "lucide-react";
import { useQRCode } from 'next-qrcode';
import { Button } from "@/components/ui/button";

export default function PersonalPage() {
  const { Canvas } = useQRCode();
  return (
    <div className="flex h-full w-full flex-col px-[2rem] pt-[2rem] text-[#4B5563]">
      <div className="h-[4rem] w-full bg-[#E5E7EB]">
        <div className="flex h-full w-full px-[0.75rem] py-[0.5rem]">
          <div className="flex h-full flex-initial">
            <SquareUserRound
              className="m-auto"
              width={"2rem"}
              height={"2rem"}
            />
          </div>
          <div className="flex flex-none flex-col pl-[0.75rem] text-left font-bold">
            <div>個人排名：</div>
            <div>團體排名：</div>
          </div>
          <div className="flex-1 flex-col pl-[0.5rem] text-right font-bold">
            <div>1000/2000</div>
            <div>10/99</div>
          </div>
        </div>
      </div>
      <div className="mt-[2rem] h-auto w-full bg-[#E5E7EB]">
        <div className="flex flex-col p-[1rem]">
          <div className="flex">
            <UserRound width={20} height={23} />
            <p className="pl-[0.5rem] font-bold">關於我</p>
          </div>
          <div className="flex mx-auto">
            <Canvas
              text={'https://sitcon.org/2025'}
              options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: '#4B5563FF',
                  light: '#E5E7EBFF',
                },
              }}
            />
          </div>
          <div className="flex mx-auto">
            <p>這是一段沒有意義的文字，這只是為了要充滿文字的頁面，讓這個頁面看起來很豐富，你覺得這個頁面怎麼樣呢？</p>
          </div>
          <div className="flex pt-[1rem]">
            <Button className="mx-auto font-bold text-md bg-purple-500">分享</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
