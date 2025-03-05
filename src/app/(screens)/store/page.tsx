"use client";

import { Button } from "@/components/ui/button";
import LotteryChooser from "@/components/LotteryChooser";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import usePlayerData from "@/hooks/usePlayerData";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import useToken from "@/hooks/useToken";
import { Lottery, LotteryItem, LotteryPriceList, ErrorItem } from "@/lib/interface";
import ErrorCard from "@/components/ui/error-card";

export default function StorePage() {
  const [lotteryAmount, setLotteryAmount] = useState(0);
  const [lotteryChooserOpen, setLotteryChooserOpen] = useState(false);

  const { playerData } = usePlayerData();
  const token = useToken();

  // 🎯 1. 取得 Lottery Items
  const {
    data: lotteryItems,
    isLoading: isLoadingItems,
    isError: isErrorItems,
    error: errorItems,
  } = useQuery<LotteryItem[]>({
    queryKey: ["lottery_items", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/items?token=${token}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.message}`);
      }
      return response.json();
    },
  });

  // 🎯 2. 取得 Price List
  const {
    data: priceList,
    isLoading: isLoadingPrice,
    isError: isErrorPrice,
    error: errorPrice,
  } = useQuery<LotteryPriceList[]>({
    queryKey: ["price", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/price?token=${token}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.message}`);
      }
      return response.json();
    },
  });

  // 🎯 3. 取得 Lottery List
  const {
    data: lotteryList,
    isLoading: isLoadingLottery,
    isError: isErrorLottery,
    error: errorLottery,
  } = useQuery<Lottery[]>({
    queryKey: ["lottery", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery?token=${token}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.message}`);
      }
      return response.json();
    },
  });

  // 🛠 **統一管理 Loading 狀態**
  if (isLoadingItems || isLoadingPrice || isLoadingLottery) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // ❌ **統一管理 Error 狀態**
  if (isErrorItems || isErrorPrice || isErrorLottery) {
    const errorItemsFromAPI: ErrorItem[] = [];
    if (isErrorItems) {
      errorItemsFromAPI.push({ icon: '🎟️', label: 'Lottery Items Error', message: errorItems?.message ?? 'Unknown error' })
    };
    if (isErrorPrice) {
      errorItemsFromAPI.push({ icon: '💰', label: 'Price List Error', message: errorPrice?.message ?? 'Unknown error' })
    }
    if (isErrorLottery) {
      errorItemsFromAPI.push({ icon: '🎫', label: 'Lottery List Error', message: errorLottery?.message ?? 'Unknown error' })
    }
    return (
      <ErrorCard
        errorItems={errorItemsFromAPI}
      />
    );
  }

  return (
    <>
      <section id="points_overview" className="flex w-full">
        <div className="ml-5 w-full py-3 pl-3">
          <p className="text-lg text-gray-400">點數</p>
          <p className={cn(`text-3xl`)}>{playerData?.points ?? "載入中..."}</p>
        </div>
      </section>
      <div className="overflow-y-scroll">
        <section id="lottery" className="w-full px-5 pt-2">
          <p className="py-2 text-lg">抽獎卷</p>
          <div className="flex flex-row items-center gap-3">
            <div className="self-start">
              <Ticket className="text-foreground" size={50} />
            </div>
            <div className="flex flex-grow flex-col gap-2 pt-2">
              {priceList?.map((ticket, index) => (
                <div
                  key={ticket.num}
                  className="flex items-center justify-between"
                >
                  <Button
                    disabled={
                      !playerData ||
                      (playerData && ticket.price > playerData.points)
                    }
                    variant="default"
                    className="flex-grow bg-blue-500 px-4 py-2 transition active:scale-95"
                    onClick={() => {
                      setLotteryAmount(ticket.num);
                      setLotteryChooserOpen(true);
                    }}
                  >
                    <span>
                      {ticket.num} 張 - {ticket.price}點
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <LotteryChooser
        amount={lotteryAmount}
        lotteryList={lotteryItems ?? []}
        myLotteryList={lotteryList ?? []}
        token={token ?? ""}
        isOpen={lotteryChooserOpen}
        setIsOpenAction={setLotteryChooserOpen}
      />
    </>
  );
}
