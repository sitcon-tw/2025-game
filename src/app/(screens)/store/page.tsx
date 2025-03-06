"use client";

import { Button } from "@/components/ui/button";
import LotteryChooser from "@/components/LotteryChooser";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import usePlayerData from "@/hooks/usePlayerData";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import useToken from "@/hooks/useToken";
import { Lottery, LotteryItem, LotteryPriceList } from "@/lib/interface";

export default function StorePage() {
  const [lotteryAmount, setLotteryAmount] = useState(0);
  const [lotteryChooserOpen, setLotteryChooserOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const { playerData } = usePlayerData();
  const token = useToken();

  const { data: lotteryItems } = useQuery<LotteryItem[]>({
    queryKey: ["lottery_items", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/items?token=${token}`);
      return response.json();
    },
  });

  const { data: priceList } = useQuery<LotteryPriceList[]>({
    queryKey: ["price", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/price?token=${token}`);
      return response.json();
    },
  });

  const { data: lotteryList } = useQuery<Lottery[]>({
    queryKey: ["lottery", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery?token=${token}`);
      return response.json();
    },
  });

  useEffect(() => {
    if (token && lotteryItems && priceList && lotteryList) {
      setLoading(false);
    }
  }, [lotteryItems, lotteryList, priceList, token]);

  if (loading || !(token && lotteryItems && priceList && lotteryList)) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
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
          <p className="py-2 text-lg">抽獎券</p>
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
        lotteryList={lotteryItems}
        myLotteryList={lotteryList}
        token={token}
        isOpen={lotteryChooserOpen}
        setIsOpenAction={setLotteryChooserOpen}
      />
    </>
  );
}
