"use client";
import QrCodeScanner from "@/components/QrCodeScanner";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { Html5QrcodeResult } from "html5-qrcode";
import { LogOut, FilePenLine } from "lucide-react";
import Block from "@/components/Block";
export default function FragmentPage() {
  function onScanSuccess(decodedText: string) {
    // 拿到QRcode掃描結果應該要包含
    // {
    //   "playerId": "1234567890",
    //   "blocks":{ } 分享的板塊內容
    // }
    // 拿到後去打API更新分享的板塊資料
    // 有可能要做身分驗證?
    console.log(decodedText);
  }

  const testBlocks = [
    {
      type: "0",
      quentity: 2,
    },
    {
      type: "4",
      quentity: 96,
    },
    {
      type: "7",
      quentity: 12,
    },
  ];
  // TODO:: 使用useEffect去fetch sharedBlocks資料
  const sharedBlocks = [
    { playerAvatar: "https://picsum.photos/id/1/50/50", blocks: testBlocks },
    { playerAvatar: "https://picsum.photos/id/2/50/50", blocks: testBlocks },
    { playerAvatar: "https://picsum.photos/id/3/50/50", blocks: testBlocks },
    { playerAvatar: "https://picsum.photos/id/4/50/50", blocks: testBlocks },
  ];

  return (
    <div className="h-full">
      <section className="min-h-[100vw] w-full">
        <QrCodeScanner qrCodeSuccessCallback={onScanSuccess} />
        <LogOut className="absolute right-6 top-6 z-20" size={48} />
      </section>
      <hr className="h-1 bg-gray-500" />
      <section className="flex justify-between px-6 py-4">
        <div className="flex flex-col justify-between">
          <h3>我的玩家連結板塊</h3>
          <div className="flex gap-8">
            {testBlocks.map((block, index) => (
              <Block key={index} type={block.type} quentity={block.quentity} />
            ))}
          </div>
        </div>
        <div className="flex w-[30%] flex-col gap-1 font-bold">
          <button className="flex w-full items-center justify-start gap-2 rounded-md bg-[#4b5c6b] px-4 py-2 text-white">
            <FilePenLine size={18} />
            <p>edit</p>
          </button>
          <button className="flex w-full justify-start rounded-md bg-[#4b5c6b] p-2 px-4 text-white">
            Qr-code
          </button>
        </div>
      </section>
      <hr className="h-1 bg-gray-500" />
      <section className="flex flex-col justify-between gap-4 px-6 py-4">
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
                    quentity={block.quentity}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
