"use client";

import { Button } from "@/components/ui/button";
import LotteryChooser from "@/components/LotteryChooser";
import {
  ArrowUpDown,
  RotateCcwSquare,
  Bomb,
  SquareArrowOutUpRight,
  TicketPercent,
  Ticket,
} from "lucide-react";
import { useState } from "react";

export default function StorePage() {
  const points = 12345678; // TODO: 積分獲取
  const [lotteryAmount, setLotteryAmount] = useState(0);
  const [lotteryChooserOpen, setLotteryChooserOpen] = useState(false);

  return (
    <>
      <section id="points_overview" className="flex w-full">
        <div className="ml-5 w-full py-3 pl-3">
          <p className="text-lg text-gray-400">積分</p>
          <p className="text-3xl">{points}</p>
        </div>
      </section>
      <div className="overflow-y-scroll">
        <section id="props" className="w-full px-5">
          <p className="pb-2 text-lg">道具</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="mb-2 bg-[#7b8795] p-1">
                <ArrowUpDown className="text-[#4f5c6a]" size={40} />
              </div>
              <Button
                variant="default"
                className="w-auto bg-[#6358ec] transition active:scale-95"
              >
                <span className="text-base">1000點</span>{" "}
                {/** TODO: fetch price from API **/}
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 bg-[#7b8795] p-1">
                <RotateCcwSquare className="text-[#4f5c6a]" size={40} />
              </div>
              <Button
                variant="default"
                className="w-auto bg-[#6358ec] transition active:scale-95"
              >
                <span className="text-base">500點</span>{" "}
                {/** TODO: fetch price from API **/}
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 bg-[#7b8795] p-1">
                <Bomb className="text-[#4f5c6a]" size={40} />
              </div>
              <Button
                variant="default"
                className="w-auto bg-[#6358ec] transition active:scale-95"
              >
                <span className="text-base">500點</span>{" "}
                {/** TODO: fetch price from API **/}
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 bg-[#7b8795] p-1">
                <SquareArrowOutUpRight className="text-[#4f5c6a]" size={40} />
              </div>
              <Button
                variant="default"
                className="w-auto bg-[#6358ec] transition active:scale-95"
              >
                <span className="text-base">2000點</span>{" "}
                {/** TODO: fetch price from API **/}
              </Button>
            </div>
          </div>
        </section>
        <section id="coupons" className="w-full px-5 pt-2">
          <p className="py-2 text-lg">紀念品折價卷</p>
          <div className="flex flex-row items-center gap-3">
            <div className="self-start">
              <TicketPercent className="text-[#4b5c6bff]" size={50} />
            </div>
            <div className="flex flex-grow flex-col gap-2 pt-2">
              {[
                { amount: "5", points: "1000", remaining: "500", limit: "2" },
                { amount: "20", points: "5000", remaining: "50", limit: "1" },
                { amount: "50", points: "10000", remaining: "10", limit: "1" },
              ].map((coupon, index) => (
                <div
                  key={coupon.amount}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="default"
                    className="flex-grow bg-[#6358ec] px-4 py-2 transition active:scale-95"
                  >
                    <span>
                      {coupon.amount} 元折價卷 {coupon.points}點
                    </span>
                  </Button>
                  <span className="ml-4 text-center text-sm">
                    剩餘 {coupon.remaining} 張<br />
                    每人限購 {coupon.limit} 張
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="coupons" className="w-full px-5 pt-2">
          <p className="py-2 text-lg">抽獎卷</p>
          <div className="flex flex-row items-center gap-3">
            <div className="self-start">
              <Ticket className="text-[#4b5c6bff]" size={50} />
            </div>
            <div className="flex flex-grow flex-col gap-2 pt-2">
              {[
                { amount: "1", points: "1000" },
                { amount: "6", points: "5000" },
                { amount: "15", points: "10000" },
              ].map((ticket, index) => (
                <div
                  key={ticket.amount}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="default"
                    className="flex-grow bg-[#6358ec] px-4 py-2 transition active:scale-95"
                    onClick={() => {
                      setLotteryAmount(parseInt(ticket.amount));
                      setLotteryChooserOpen(true);
                    }}
                  >
                    <span>
                      {ticket.amount} 張 - {ticket.points}點
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
        isOpen={lotteryChooserOpen}
        setIsOpen={setLotteryChooserOpen}
      />
    </>
  );
}
