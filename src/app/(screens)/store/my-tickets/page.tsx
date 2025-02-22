"use client";

import { Button } from "@/components/ui/button";
import { TicketPercent, Ticket } from "lucide-react";
import { useState } from "react";
import CouponCodeDialog from "@/components/CouponCodeDialog";

export default function MyTicketsPage() {
  const exampleLottery = [
    {
      name: "SITCON 2025 鍵帽",
      amount: 2,
      lottery_list: ["A00094"],
    },
    {
      name: "獎品名稱 B",
      amount: 10,
      lottery_list: [],
    },
    {
      name: "獎品名稱 C",
      amount: 1,
      lottery_list: [
        "C00194",
        "C00195",
        "C00196",
        "C00197",
        "C00198",
        "C00199",
        "C00278",
        "C00279",
        "C00280",
        "C00281",
        "C00282",
        "C00283",
        "C00284",
        "C00285",
        "C00286",
        "C00287",
        "C00288",
        "C00289",
        "C00290",
        "C00291",
        "C00292",
        "C00293",
      ],
    },
  ];

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  return (
    <>
      <section id="coupons" className="w-full px-5 pt-14">
        <p className="py-2 text-lg">紀念品折價卷</p>
        <div className="flex flex-row items-center gap-3">
          <div className="self-start">
            <TicketPercent className="text-[#4b5c6bff]" size={50} />
          </div>
          <div className="flex flex-grow flex-col gap-2 pt-2">
            {[{ amount: "5" }, { amount: "20" }, { amount: "50" }].map(
              (coupon) => (
                <div
                  key={coupon.amount}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="default"
                    className="flex-grow bg-[#6358ec] px-4 py-2 transition active:scale-95"
                    onClick={() => setCouponDialogOpen(true)}
                  >
                    <span>{coupon.amount} 元折價卷</span>
                  </Button>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      <section id="lottery" className="w-full px-5 pt-2">
        <p className="py-2 text-lg">抽獎卷</p>
        <div className="flex flex-row items-center gap-3">
          <div className="self-start">
            <Ticket className="text-[#4b5c6bff]" size={50} />
          </div>
          <div className="flex flex-grow flex-col gap-2 pt-2">
            {exampleLottery.map((lottery, index) => {
              const isExpanded = expanded[index];
              const displayedList = isExpanded
                ? lottery.lottery_list
                : lottery.lottery_list.slice(0, 20);

              return (
                <div
                  key={index}
                  className="flex flex-col items-start justify-between"
                >
                  <Button
                    variant="outline"
                    className="relative w-full cursor-default border-[#6358ec] px-4 py-2 text-[#6358ec] hover:border-[#6358ec] hover:bg-white hover:text-[#6358ec]"
                  >
                    <span>{lottery.name}</span>
                    <span className="absolute bottom-0 right-0 pr-1 text-black">
                      抽 {lottery.amount} 名
                    </span>
                  </Button>
                  {lottery.lottery_list.length > 0 && (
                    <>
                      <div className="relative grid w-full grid-cols-[repeat(auto-fill,minmax(65px,1fr))]">
                        {displayedList.map((lotteryId) => (
                          <span
                            key={lotteryId}
                            className="whitespace-normal pl-2 text-black"
                          >
                            {lotteryId}
                          </span>
                        ))}
                        {lottery.lottery_list.length > 20 && (
                          <Button
                            variant="ghost"
                            className="absolute -bottom-8 right-0 h-fit w-fit text-black active:scale-90"
                            onClick={() => toggleExpand(index)}
                          >
                            {isExpanded ? "收起" : "顯示更多"}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CouponCodeDialog
        isOpen={couponDialogOpen}
        setIsOpen={setCouponDialogOpen}
      />
    </>
  );
}
