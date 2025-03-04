"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Archive, ChevronUp, ChevronDown, X, OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Lottery, LotteryItem } from "@/lib/interface";

function LotteryListing({
  lottery,
  amounts,
  lotteryRecord,
  myLottery,
  lotteryIndex,
  toggleLotteryUp,
  toggleLotteryDown,
}: {
  lottery: LotteryItem;
  amounts: number;
  lotteryRecord: Record<number, number>;
  myLottery: Lottery | undefined;
  lotteryIndex: number;
  toggleLotteryUp: (index: number) => void;
  toggleLotteryDown: (index: number) => void;
}) {
  const submitted = myLottery?.lottery_list.length ?? 0;

  return (
    <div className="flex w-full flex-row items-center">
      <Archive size={80} className="mr-2 text-white" />
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          className="h-8 w-10 transition active:scale-90 [&_svg]:size-8"
          onClick={() => toggleLotteryUp(lotteryIndex)}
          disabled={amounts == 0}
        >
          <ChevronUp size={48} />
        </Button>
        <span className="text-2xl font-semibold">
          {lotteryRecord[lotteryIndex]}
        </span>
        <Button
          variant="ghost"
          className="h-8 w-10 transition active:scale-90 [&_svg]:size-8"
          onClick={() => toggleLotteryDown(lotteryIndex)}
          disabled={lotteryRecord[lotteryIndex] == 0}
        >
          <ChevronDown size={48} />
        </Button>
      </div>
      <span className="flex-grow break-words pl-1 text-[24px]">
        {lottery.name}
        <div>
          <span className="text-base">抽 {lottery.maxDrawn} 名 | </span>
          <span className="text-base">
            {lotteryRecord[lotteryIndex] + submitted} / {lottery.total}
          </span>
        </div>
      </span>
    </div>
  );
}

export default function LotteryChooser({
  amount,
  lotteryList,
  myLotteryList,
  token,
  isOpen,
  setIsOpenAction,
}: {
  amount: number;
  lotteryList: LotteryItem[];
  myLotteryList: Lottery[];
  token: string;
  isOpen: boolean;
  setIsOpenAction: (isOpen: boolean) => void;
}) {
  const [amounts, setAmounts] = useState(0);
  const [lottery, setLottery] = useState<Record<number, number>>(
    lotteryList.map(() => 0),
  );

  const toggleLotteryUp = (index: number) => {
    if (amounts - 1 < 0) return;
    setLottery((prev) => ({ ...prev, [index]: prev[index] + 1 }));

    setAmounts((prev) => prev - 1);
  };

  const toggleLotteryDown = (index: number) => {
    if (lottery[index] == 0) return;
    setLottery((prev) => ({ ...prev, [index]: prev[index] - 1 }));
    setAmounts((prev) => prev + 1);
  };

  const submitLottery = async () => {
    const submission = lotteryList.map((lotteryItem, index) => {
      return { id: lotteryItem.id, num: lottery[index] };
    });
    // console.log(JSON.stringify(submission));
    const result = await fetch(`/api/lottery/submit?token=${token}`, {
      method: "POST",
      body: JSON.stringify(submission),
    });
    if (result.ok) {
      setIsOpenAction(false);
      setLottery(lotteryList.map(() => 0));
      window.location.reload();
    }
  };
  const closeDialog = () => {
    setLottery(lotteryList.map(() => 0));
    setIsOpenAction(false);
  };

  useEffect(() => {
    if (isOpen) {
      setAmounts(amount);
    }
  }, [amount, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: "auto" }}
          className="fixed inset-0 z-50 m-0 flex items-center justify-center bg-black/60 text-foreground"
          onClick={() => {
            setIsOpenAction(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 10, filter: "blur(0.35em)" }}
            animate={{ scale: 0.9, opacity: 1, y: 0, filter: "blur(0)" }}
            exit={{ scale: 0.8, opacity: 0, y: 10, filter: "blur(0.3em)" }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full flex-col items-center rounded-lg bg-background p-8 md:static md:max-w-[70%] md:justify-start lg:max-w-[60%]"
          >
            <div className="mb-5 flex w-full flex-row items-center text-start text-3xl font-bold text-white">
              <Archive size={48} className="mr-2 text-white" />
              <span>抽獎箱</span>
              <Button
                variant="ghost"
                className="ml-auto w-10 [&_svg]:size-10"
                onClick={() => closeDialog()}
              >
                <X size={32} />
              </Button>
            </div>
            <div
              className={`flex w-full pl-1 ${amounts == 0 ? "text-red-400" : ""}`}
            >
              <p className="pr-2 text-left text-2xl font-bold">{amounts}</p>
              <p className="self-end text-left"> / {amount} 張抽獎卷可用</p>
            </div>
            <hr className="my-6 h-0.5 w-full border-t-0 bg-gray-400" />
            <div className="flex w-full flex-col gap-4">
              {lotteryList.map((lotteryItem, index) => (
                <LotteryListing
                  key={index}
                  amounts={amounts}
                  lottery={lotteryItem}
                  myLottery={
                    myLotteryList.filter(
                      (value) => value.type == lotteryItem.id,
                    )[0]
                  }
                  lotteryRecord={lottery}
                  lotteryIndex={index}
                  toggleLotteryUp={toggleLotteryUp}
                  toggleLotteryDown={toggleLotteryDown}
                />
              ))}
            </div>
            <div className="absolute bottom-3 w-full px-10">
              {amounts != 0 && (
                <span className="mt-2 flex flex-row items-center justify-center gap-2 text-red-400">
                  <OctagonAlert size={24} />
                  您還有抽獎卷沒使用！
                </span>
              )}
              <motion.button
                whileHover="hover"
                initial="rest"
                exit="rest"
                className="mt-2 flex w-full justify-center rounded-lg bg-[#6358ec] px-10 py-3 text-lg text-white transition active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                onClick={() => submitLottery()}
                disabled={amounts != 0}
              >
                確認送出
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
