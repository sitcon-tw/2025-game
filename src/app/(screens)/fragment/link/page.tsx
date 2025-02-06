"use client";
import QrCodeScanner from "@/components/QrCodeScanner";

import { ChevronUp, ChevronDown, FilePenLine, X } from "lucide-react";
import Block from "@/components/Block";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type DisplayBlock = {
  type: string;
  blockImg: string;
  quantity: number;
};

type SharingBlock = {
  type: string;
  quantity: number;
};
const initialDisplayBlocks = [
  {
    type: "0",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "1",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "2",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "3",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "4",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "5",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "6",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
  {
    type: "7",
    quantity: 0,
    blockImg: "https://picsum.photos/id/1/50/50",
  },
];

const testBlocks = [
  {
    type: "0",
    quantity: 2,
  },
  {
    type: "4",
    quantity: 96,
  },
  {
    type: "7",
    quantity: 12,
  },
];
// TODO:: get blocks from API
const myBlocks = [
  {
    type: "0",
    quantity: 1,
  },
  {
    type: "1",
    quantity: 2,
  },
  {
    type: "2",
    quantity: 3,
  },
  {
    type: "3",
    quantity: 4,
  },
  {
    type: "4",
    quantity: 1,
  },
  {
    type: "5",
    quantity: 1,
  },
  {
    type: "6",
    quantity: 1,
  },
  {
    type: "7",
    quantity: 1,
  },
];
export default function LinkPage() {
  const [popupType, setPopupType] = useState<"qrcode" | "edit" | null>(null);

  const onScanSuccess = (decodedText: string) => {
    // 拿到QRcode掃描結果應該要包含
    // {
    //   "playerId": "1234567890",
    //   "blocks":{ } 分享的板塊內容
    // }
    // TODO::
    // 拿到後去打API更新分享的板塊資料
    // 後端要驗證對方是否有足夠的對應板塊可以分享 && 不可大於3塊
    // 還可以增加掃到了之後的UI提示
    // 要注意這裡會一直偵測所以要小心不要一直打API
    console.log(decodedText);
  };

  // TODO:: 使用useEffect去fetch sharedBlocks資料 getSharedBlocks from API
  const sharedBlocks = [
    { playerAvatar: "https://picsum.photos/id/1/50/50", blocks: testBlocks },
    { playerAvatar: "https://picsum.photos/id/2/50/50", blocks: testBlocks },
    { playerAvatar: "https://picsum.photos/id/3/50/50", blocks: testBlocks },
    { playerAvatar: "https://picsum.photos/id/4/50/50", blocks: testBlocks },
  ];

  return (
    <div className="relative pb-6">
      <section className="min-h-[100vw] w-full">
        <QrCodeScanner qrCodeSuccessCallback={onScanSuccess} />
      </section>
      <hr className="h-1 bg-gray-500" />
      <section className="flex justify-between px-4 py-4">
        <div className="flex flex-col justify-between">
          <h3>我的玩家連結板塊</h3>
          <div className="flex gap-8">
            {testBlocks.map((block, index) => (
              <Block key={index} type={block.type} quantity={block.quantity} />
            ))}
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
          {sharedBlocks.map((sharedBlock) => (
            <div key={sharedBlock.playerAvatar} className="flex gap-8">
              <img
                src={sharedBlock.playerAvatar}
                alt="Player avatar"
                className="rounded-full"
              />
              <div className="flex gap-10">
                {sharedBlock.blocks.map((block, index) => (
                  <Block
                    key={index}
                    type={block.type}
                    quantity={block.quantity}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Popup popupType={popupType} setPopupType={setPopupType} />
    </div>
  );
}

const Popup = ({
  popupType,
  setPopupType,
}: {
  popupType: "edit" | "qrcode" | null;
  setPopupType: React.Dispatch<React.SetStateAction<"edit" | "qrcode" | null>>;
}) => {
  const [qrcodePayload, setQrcodePayload] = useState<string>("");
  const [sharingBlocks, setSharingBlocks] = useState<SharingBlock[]>([]);
  const [displayBlocks, setDisplayBlocks] =
    useState<DisplayBlock[]>(initialDisplayBlocks);

  useEffect(() => {
    // 將sharingBlocks 轉換成字串存到qrcodePayload
    const payload = {
      playerId: "1234567890",
      blocks: sharingBlocks,
    };
    setQrcodePayload(JSON.stringify(payload));

    // 根據sharingBlocks 的每一項的type 去更新 displayBlocks對應type的數量

    setDisplayBlocks((prevBlocks) => {
      return prevBlocks.map((block) => {
        // 判斷是否有對應的type
        const shBlock = sharingBlocks.find(
          (shBlock) => shBlock.type === block.type,
        );

        if (shBlock) {
          return { ...block, quantity: shBlock.quantity };
        } else {
          return { ...block, quantity: 0 };
        }
      });
    });
  }, [sharingBlocks]);

  const getIsAddable = (type: string) => {
    const myBlock = myBlocks.find((block) => block.type === type);
    const myBlockQuantity = myBlock ? myBlock.quantity : 0;

    const sharedBlock = sharingBlocks.find((block) => block.type === type);
    const sharedQuantity = sharedBlock ? sharedBlock.quantity : 0;

    const totalQuantity = sharingBlocks.reduce(
      (acc, curr) => acc + curr.quantity,
      0,
    );

    if (totalQuantity >= 3) return false;

    if (sharedQuantity >= myBlockQuantity) return false;

    return true;
  };

  const getIsSubtractable = (type: string) => {
    const sharedBlock = sharingBlocks.find((block) => block.type === type);
    const sharedQuantity = sharedBlock ? sharedBlock.quantity : 0;

    if (sharedQuantity <= 0) return false;
    return true;
  };

  const handleAddBlock = (type: string) => {
    if (!getIsAddable(type)) return;

    setSharingBlocks((prevBlocks) => {
      if (!prevBlocks.find((block) => block.type === type)) {
        return [...prevBlocks, { type, quantity: 1 }];
      } else {
        return prevBlocks.map((block) =>
          block.type === type
            ? { ...block, quantity: block.quantity + 1 }
            : block,
        );
      }
    });
  };

  const handleSubtractBlock = (type: string) => {
    if (!getIsSubtractable(type)) return;

    // 檢查對應type的sharingBlock 如果數量大於0 則正常減去 如果減完為0則移除那一項
    setSharingBlocks((prevBlocks) => {
      const block = prevBlocks.find((block) => block.type === type);
      if (!block) return prevBlocks;
      if (block.quantity - 1 === 0) {
        return prevBlocks.filter((block) => block.type !== type);
      } else {
        return prevBlocks.map((block) => {
          return {
            ...block,
            quantity: block.quantity - 1,
          };
        });
      }
    });
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
                <img
                  src={block.blockImg}
                  className="aspect-square h-[80%]"
                  alt="Player avatar"
                />
                <div className="flex h-[80%] flex-col items-center justify-between">
                  <ChevronUp
                    className={
                      getIsAddable(block.type) ? "text-black" : "text-gray-400"
                    }
                    onClick={() => handleAddBlock(block.type)}
                  />
                  <p>{block.quantity}</p>
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
