"use client";
import QrCodeScanner from "@/components/QrCodeScanner";
import { ChevronUp, ChevronDown, FilePenLine, X, Plus, Minus } from "lucide-react";
import Block from "@/components/Block";
import Fragment from "@/components/Fragment";
import { useEffect, useState, useCallback } from "react";
import usePlayerData from "@/hooks/usePlayerData";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import useToken from "@/hooks/useToken";
import { motion, AnimatePresence } from "framer-motion";

import { SharedFragmentData } from "@/types/index";
import { set } from "date-fns";

type BlockType =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "obstacle"
  | "start"
  | "end"
  | "unknown"
  | "empty";

type Block = {
  type: BlockType;
  amount: number;
};

// TODO:: 把DisplayBlockType 拿掉，直接用BlockType 並且點擊+ - 應該要先更新 displayBlocks 之後再更新 sharingBlocks
// 或者兩個都抓一樣的state 把sharingBlock刪掉
const initialDisplayBlocks: Array<Block> = [
  {
    type: "a",
    amount: 0,
  },
  {
    type: "b",
    amount: 0,
  },
  {
    type: "c",
    amount: 0,
  },
  {
    type: "d",
    amount: 0,
  },
  {
    type: "e",
    amount: 0,
  },
  {
    type: "f",
    amount: 0,
  },
  {
    type: "g",
    amount: 0,
  },
];

const testBlocks: Array<Block> = [
  {
    type: "a",
    amount: 2,
  },
  {
    type: "b",
    amount: 96,
  },
  {
    type: "c",
    amount: 12,
  },
];
// TODO:: get blocks from API
const myBlocks: Array<Block> = [
  {
    type: "a",
    amount: 1,
  },
  {
    type: "b",
    amount: 2,
  },
  {
    type: "c",
    amount: 3,
  },
  {
    type: "d",
    amount: 4,
  },
  {
    type: "e",
    amount: 1,
  },
  {
    type: "f",
    amount: 1,
  },
  {
    type: "g",
    amount: 1,
  },
];

export default function LinkPage() {
  const [popupType, setPopupType] = useState<"qrcode" | "edit" | null>(null);
  const [sharingBlocks, setSharingBlocks] = useState<Block[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [sharedFragments, setSharedFragments] = useState<SharedFragmentData>(
    [],
  );
  const token = useToken();

  const queryClient = new QueryClient();

  const { isLoading, isError } = useQuery({
    queryKey: ["fragments", token],
    queryFn: async () => {
      const response = await fetch("/api/fragment/share?token=" + token);

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: SharedFragmentData = await response.json();
      setSharedFragments(data);
      return data;
    },
  });

  console.log(sharedFragments);

  const mutation = useMutation({
    mutationFn: async (qrCodeData: string) => {
      const data = JSON.parse(qrCodeData);
      console.log("fetch");
      console.log(
        JSON.stringify({
          token: token,
          friendToken: data.sharedToken,
          fragments: data.fragments,
        }),
      );

      const response = await fetch("/api/fragment/share", {
        method: "POST",
        body: JSON.stringify({
          token: token,
          friendToken: data.sharedToken,
          fragments: data.fragments,
        }),
      });

      if (!response.ok) throw new Error("API Error");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fragments", token] });

      setHasScanned(false);
      console.log("success");
    },
    onError: () => {
      setHasScanned(false);
      console.log("error");
    },
  });

  const onScanSuccess = useCallback((decodedText: string) => {
    if (hasScanned) return;

    setHasScanned(true);

    mutation.mutate(decodedText);
  }, []);

  // TODO:: 使用useEffect去fetch sharedBlocks資料 getSharedBlocks from API

  return (
    <div className="min-h-screen">
      <div className="relative mx-auto max-w-2xl pb-6">
        <section className="relative aspect-square w-full overflow-hidden rounded-b-2xl bg-black">
          <QrCodeScanner qrCodeSuccessCallback={onScanSuccess} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-lg border-4 border-white/50" />
          </div>
          {hasScanned && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="rounded-lg bg-white p-4 text-center">
                <p className="text-lg font-medium">掃描成功！</p>
                <p className="text-sm text-gray-500">正在處理...</p>
              </div>
            </div>
          )}
        </section>

        <div className="space-y-4 mt-4">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">我的連結板塊</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPopupType("edit")}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <FilePenLine size={16} />
                  編輯
                </button>
                <button
                  onClick={() => setPopupType("qrcode")}
                  className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
                >
                  分享 QR Code
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              {sharingBlocks.length ? (
                sharingBlocks.map((block, index) => (
                  <Fragment
                    key={index}
                    type={block.type}
                    amount={block.amount}
                    showAmount={true}
                  />
                ))
              ) : (
                <p className="text-gray-500">點擊編輯按鈕來設定分享板塊</p>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">獲得的板塊</h3>
            {isLoading ? (
              <p className="text-gray-500">載入中...</p>
            ) : isError ? (
              <p className="text-red-500">發生錯誤，請稍後再試</p>
            ) : sharedFragments.length === 0 ? (
              <p className="text-gray-500">還沒有獲得任何板塊</p>
            ) : (
              <div className="space-y-4">
                {sharedFragments.map((fragment) => (
                  <div
                    key={fragment.name}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    {fragment.avatar ? (
                      <img
                        src={fragment.avatar}
                        alt="Player avatar"
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <p className="text-lg font-medium text-gray-700">
                          {fragment.name[0]}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{fragment.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {fragment.fragments.map((block, index) => (
                          <Fragment
                            key={index}
                            type={block.type}
                            amount={block.amount}
                            showAmount={true}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Popup
        popupType={popupType}
        setPopupType={setPopupType}
        sharingBlocks={sharingBlocks}
        setSharingBlocks={setSharingBlocks}
      />
    </div>
  );
}

const Popup = ({
  popupType,
  setPopupType,
  sharingBlocks,
  setSharingBlocks,
}: {
  popupType: "edit" | "qrcode" | null;
  setPopupType: React.Dispatch<React.SetStateAction<"edit" | "qrcode" | null>>;
  sharingBlocks: Block[];
  setSharingBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}) => {
  const token = useToken();
  const [qrcodePayload, setQrcodePayload] = useState<string>("");
  const [displayBlocks, setDisplayBlocks] =
    useState<Block[]>(initialDisplayBlocks);

  useEffect(() => {
    // 將sharingBlocks 轉換成字串存到qrcodePayload
    const payload = {
      sharedToken: token,
      fragments: sharingBlocks,
    };
    setQrcodePayload(JSON.stringify(payload));

    // 根據sharingBlocks 的每一項的type 去更新 displayBlocks對應type的數量
  }, [sharingBlocks]);

  const getIsAddable = (type: string) => {
    const myBlock = myBlocks.find((block) => block.type === type);
    const myBlockAmount = myBlock ? myBlock.amount : 0;

    const sharedBlock = sharingBlocks.find((block) => block.type === type);
    const sharedAmount = sharedBlock ? sharedBlock.amount : 0;

    const totalAmount = sharingBlocks.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    if (totalAmount >= 3) return false;

    if (sharedAmount >= myBlockAmount) return false;

    return true;
  };

  const getIsSubtractable = (type: string) => {
    const sharedBlock = sharingBlocks.find((block) => block.type === type);
    const sharedAmount = sharedBlock ? sharedBlock.amount : 0;

    if (sharedAmount <= 0) return false;
    return true;
  };

  const handleAddBlock = (type: string) => {
    if (!getIsAddable(type)) return;

    setSharingBlocks((prevBlocks) => {
      if (!prevBlocks.find((block) => block.type === type)) {
        return [...prevBlocks, { type: type as BlockType, amount: 1 }];
      } else {
        return prevBlocks.map((block) =>
          block.type === type ? { ...block, amount: block.amount + 1 } : block,
        );
      }
    });

    setDisplayBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.type === type ? { ...block, amount: block.amount + 1 } : block,
      ),
    );
  };

  const handleSubtractBlock = (type: string) => {
    if (!getIsSubtractable(type)) return;

    // 檢查對應type的sharingBlock 如果數量大於0 則正常減去 如果減完為0則移除那一項
    setSharingBlocks((prevBlocks) => {
      const block = prevBlocks.find((block) => block.type === type);
      if (!block) return prevBlocks;
      if (block.amount - 1 === 0) {
        return prevBlocks.filter((block) => block.type !== type);
      } else {
        return prevBlocks.map((block) => {
          return block.type === type
            ? { ...block, amount: block.amount - 1 }
            : block;
        });
      }
    });

    setDisplayBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.type === type ? { ...block, amount: block.amount - 1 } : block,
      ),
    );
  };
  return (
    <AnimatePresence>
      {popupType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          {popupType === "qrcode" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-white/20 p-8 shadow-xl backdrop-blur-xl"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPopupType(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </motion.button>
              <div className="flex flex-col items-center">
                <h3 className="mb-6 text-lg font-semibold text-white">分享您的板塊</h3>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl bg-white p-4 shadow-inner"
                >
                  <QRCodeSVG width={200} height={200} value={qrcodePayload} />
                </motion.div>
                <p className="mt-4 text-sm text-gray-400">請其他玩家掃描此 QR Code</p>
              </div>
            </motion.div>
          )}

          {popupType === "edit" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-white/20 p-8 shadow-xl backdrop-blur-xl"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPopupType(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </motion.button>
              <h3 className="mb-6 text-lg font-semibold text-white">編輯分享板塊</h3>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {displayBlocks.map((block, index) => (
                  <motion.div
                    key={block.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <Fragment
                      type={block.type}
                      amount={block.amount}
                      showAmount={false}
                    />
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSubtractBlock(block.type)}
                        disabled={!getIsSubtractable(block.type)}
                        className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50"
                      >
                        <Minus size={20} />
                      </motion.button>
                      <span className="w-8 text-center font-medium text-white">{block.amount}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddBlock(block.type)}
                        disabled={!getIsAddable(block.type)}
                        className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50"
                      >
                        <Plus size={20} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
