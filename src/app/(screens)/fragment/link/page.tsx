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
      quentity: 9,
    },
    {
      type: "7",
      quentity: 12,
    },
  ];

  return (
    <>
      <section className="min-h-[100vw] w-full">
        <QrCodeScanner qrCodeSuccessCallback={onScanSuccess} />
        <LogOut className="absolute right-6 top-6 z-20" size={48} />
      </section>
      <section className="flex justify-between p-4">
        <div className="flex flex-col justify-between">
          <h3>我的玩家連結板塊</h3>
          <div className="flex w-full justify-between gap-4">
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
      <section></section>
    </>
  );
}
