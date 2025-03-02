"use client";

import { Button } from "@/components/ui/button";
import couponData from "@/config/coupons.json";
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
import usePlayerData from "@/hooks/usePlayerData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function StorePage() {
  const points = 12345678; // TODO: 積分獲取
  const [lotteryAmount, setLotteryAmount] = useState(0);
  const [lotteryChooserOpen, setLotteryChooserOpen] = useState(false);

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { playerData } = usePlayerData();

  const queryClient = useQueryClient();

  const buyCouponMutation = useMutation({
    mutationFn: async (couponType: number) => {
      await fetch(`/api/buy/coupon`, {
        method: "POST",
        body: JSON.stringify({ couponType, token: playerData?.token }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coupons", playerData?.token],
      });
    },
  });

  function showDialog(title: string, content: string) {
    setDialogTitle(title);
    setDialogContent(content);
    setIsDialogOpen(true);
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
              <TicketPercent className="text-foreground" size={50} />
            </div>
            <div className="flex flex-grow flex-col gap-2 pt-2">
              {couponData.map((coupon, index) => (
                <div
                  key={coupon.discount}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="default"
                    className="flex-grow bg-[#6358ec] px-4 py-2 transition active:scale-95"
                    onClick={() => {
                      buyCouponMutation.mutate(coupon.discount);
                      showDialog(
                        "購買成功",
                        `已購買 ${coupon.discount} 元折價卷`,
                      );
                    }}
                  >
                    <span>
                      {coupon.discount} 元折價卷 {coupon.price}點
                    </span>
                  </Button>
                  <span className="ml-4 text-center text-sm">
                    剩餘 {coupon.total} 張<br />
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
              <Ticket className="text-foreground" size={50} />
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
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: isDialogOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex w-2/3 flex-col items-center gap-2 rounded-lg bg-primary p-4 text-foreground"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <div className="text-2xl font-bold">{dialogTitle}</div>
              <div className="text-lg">
                <p>{dialogContent}</p>
              </div>
              <button
                className="mt-4 rounded-lg bg-secondary px-4 py-2 text-foreground"
                onClick={() => {
                  setIsDialogOpen(false);
                }}
              >
                完成
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
