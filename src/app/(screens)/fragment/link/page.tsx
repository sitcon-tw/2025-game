"use client";
import QrCodeScanner from "@/components/QrCodeScanner";
import { ChevronUp, ChevronDown, FilePenLine, X } from "lucide-react";
import Block from "@/components/Block";
import Fragment from "@/components/Fragment";
import { useEffect, useState, useCallback } from "react";
import usePlayerData from "@/hooks/usePlayerData";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import useToken from "@/hooks/useToken";

import { SharedFragmentData } from "@/types/index";

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
  const token = useToken();

  const { data: sharedFragments } = useQuery({
    queryKey: ["fragments", token],
    queryFn: async () => {
      const response = await fetch("/api/fragment/share?token=" + token);

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: SharedFragmentData = await response.json();
      return data;
    },
  });

  console.log(sharedFragments);

  const onScanSuccess = useCallback((decodedText: string) => {
    // 拿到QRcode掃描結果應該要包含
    // {
    //   "sharedToken": "1234567890",
    //   "blocks":{ } 分享的板塊內容
    // }
    // TODO::
    // 拿到後去打API更新分享的板塊資料
    // 後端要驗證對方是否有足夠的對應板塊可以分享 && 不可大於3塊
    // post request body:{
    //  token: string,
    //  friendToken: string,
    //  fragments:[]
    // }
    // 還可以增加掃到了之後的UI提示
    // 要注意這裡會一直偵測所以要小心不要一直打API
    console.log(decodedText);
  }, []);

  // TODO:: 使用useEffect去fetch sharedBlocks資料 getSharedBlocks from API

  return (
    <>
      <div className="relative pb-6">
        <section className="aspect-square w-full">
          <QrCodeScanner qrCodeSuccessCallback={onScanSuccess} />
        </section>
        <hr className="h-1 bg-gray-500" />
        <section className="flex justify-between px-4 py-4">
          <div className="flex flex-col justify-between">
            <h3>我的玩家連結板塊</h3>
            <div className="flex gap-8">
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
                <p>點擊edit設定分享板塊</p>
              )}
            </div>
          </div>
          <div className="flex w-[30%] flex-col gap-1 font-bold">
            <button
              onClick={() => setPopupType("edit")}
              className="flex w-full items-center justify-start gap-2 rounded-md bg-[#4b5c6b] px-4 py-2 text-white"
            >
              <FilePenLine size={18} />
              <p>edit</p>
            </button>
            <button
              onClick={() => setPopupType("qrcode")}
              className="flex w-full justify-start rounded-md bg-[#4b5c6b] p-2 px-4 text-white"
            >
              Qr-code
            </button>
          </div>
        </section>
        <hr className="h-1 bg-gray-500" />
        <section className="flex flex-col justify-between gap-4 px-4 py-4">
          <h3>獲得的板塊</h3>
          <div className="flex flex-col gap-4">
            {sharedFragments &&
              sharedFragments.map((fragment) => (
                <div key={fragment.name} className="flex gap-8">
                  {fragment.avatar ? (
                    <img
                      src={fragment.avatar}
                      alt="Player avatar"
                      className="rounded-full"
                    />
                  ) : (
                    <p className="flex items-center">{fragment.name}</p>
                  )}
                  <div className="flex gap-10">
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
              ))}
          </div>
        </section>
      </div>
      <Popup
        popupType={popupType}
        setPopupType={setPopupType}
        sharingBlocks={sharingBlocks}
        setSharingBlocks={setSharingBlocks}
      />
    </>
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
    <>
      {/* TODO:framer motion 加彈出和消失動畫 */}
      {/* 彈出提示框 */}
      {popupType === "qrcode" && (
        <div className="absolute left-1/2 top-1/2 z-50 flex h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-lg border-2 border-[#6558f5] bg-white p-4 shadow-lg">
          <X
            onClick={() => setPopupType(null)}
            className="absolute right-2 top-2"
          />
          <QRCodeSVG width={200} height={200} value={qrcodePayload} />
        </div>
      )}
      {popupType === "edit" && (
        <div className="absolute left-1/2 top-1/2 z-50 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg border-2 border-[#6558f5] bg-white p-8 shadow-lg">
          <X
            onClick={() => setPopupType(null)}
            className="absolute right-2 top-2"
          />
          <div className="grid h-full w-full grid-cols-2 gap-y-2">
            {displayBlocks.map((block, index) => (
              <div
                className={`flex items-center gap-1 ${index % 2 ? "justify-end" : "justify-start"}`}
                key={block.type}
              >
                <Fragment
                  type={block.type}
                  amount={block.amount}
                  withType={false}
                />
                <div className="flex flex-col items-center justify-between">
                  <ChevronUp
                    className={
                      getIsAddable(block.type) ? "text-black" : "text-gray-400"
                    }
                    onClick={() => handleAddBlock(block.type)}
                  />
                  <p>{block.amount}</p>
                  <ChevronDown
                    className={
                      getIsSubtractable(block.type)
                        ? "text-black"
                        : "text-gray-400"
                    }
                    onClick={() => handleSubtractBlock(block.type)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
