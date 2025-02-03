"use client";
import QrCodeScanner from "@/components/QrCodeScanner";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { Html5QrcodeResult } from "html5-qrcode";
import { LogOut } from "lucide-react";
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

  return (
    <>
      <div className="w-full">
        <QrCodeScanner qrCodeSuccessCallback={onScanSuccess} />
        <LogOut className="absolute right-6 top-6 z-20" size={48} />
      </div>
    </>
  );
}
