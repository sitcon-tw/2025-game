"use client";

import { Button } from "@/components/ui/button";
import { Ticket, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import { Lottery, LotteryItem } from "@/lib/interface";

export default function MyTicketsPage() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const [loading, setLoading] = useState(true);
  const token = useToken();

  const { data: lotteryItems } = useQuery<LotteryItem[]>({
    queryKey: ["lottery_items", token],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/items?token=${token}`);
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
    if (token && lotteryItems && lotteryList) {
      setLoading(false);
    }
  }, [lotteryItems, lotteryList, token]);

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <>
      <section id="lottery" className="w-full px-5 pt-2">
        <p className="py-2 text-lg">抽獎卷</p>
        <div className="flex flex-row items-center gap-3">
          <div className="self-start">
            <Ticket className="text-foreground" size={50} />
          </div>
          <div className="flex flex-grow flex-col gap-2 pt-2">
            {lotteryItems?.map((lottery, index) => {
              const targetList = lotteryList?.find(
                (value) => value.type === lottery.id,
              ) ?? { lottery_list: [] };
              const isExpanded = expanded[index];
              const isSelectedList = targetList?.lottery_list.filter(
                (value) => value.is_selected,
              );
              const restList = targetList?.lottery_list.filter(
                (value) => !value.is_selected,
              );
              const displayedList = isExpanded
                ? restList
                : restList.slice(0, 20);

              return (
                <div
                  key={index}
                  className="mb-6 flex flex-col items-start justify-between"
                >
                  <Button
                    variant="outline"
                    className="relative w-full cursor-default border-blue-300 px-4 py-2 text-blue-200 hover:border-blue-300 hover:bg-blue-200 hover:text-blue-200"
                  >
                    <span className="text-base">{lottery.name}</span>
                    <span className="absolute bottom-0 right-0 pr-1 text-foreground">
                      抽 {lottery.maxDrawn} 名
                    </span>
                  </Button>
                  {targetList.lottery_list.length > 0 ? (
                    <>
                      {isSelectedList.length > 0 && (
                        <div className="mt-3 w-full border-b-2 border-b-gray-500 pb-2">
                          <div className="mb-1 flex items-center font-medium text-blue-300">
                            <Award size="24" />
                            抽中的獎券
                          </div>
                          <div className="relative grid w-full grid-cols-[repeat(auto-fill,minmax(65px,1fr))]">
                            {isSelectedList.map((lotteryId) => (
                              <span
                                key={lotteryId.lottery_id}
                                className={`whitespace-normal pl-2 text-foreground ${lotteryId.is_selected && "font-bold text-red-400 underline"}`}
                              >
                                {lotteryId.lottery_id}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="relative mt-2 grid w-full grid-cols-[repeat(auto-fill,minmax(65px,1fr))]">
                        {displayedList.map((lotteryId) => (
                          <span
                            key={lotteryId.lottery_id}
                            className={`whitespace-normal pl-2 text-foreground ${lotteryId.is_selected && "font-bold text-red-400 underline"}`}
                          >
                            {lotteryId.lottery_id}
                          </span>
                        ))}
                        {targetList.lottery_list.length > 20 && (
                          <Button
                            variant="ghost"
                            className="absolute -bottom-8 right-0 h-fit w-fit text-foreground active:scale-90"
                            onClick={() => toggleExpand(index)}
                          >
                            {isExpanded ? "收起" : "顯示更多"}
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="mx-auto mt-4 text-gray-500">
                      您尚未購買抽獎卷
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
