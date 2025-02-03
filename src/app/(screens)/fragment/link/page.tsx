"use client";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
export default function FragmentPage() {
  const onNewScanResult = (data: string) => {
    // 拿到QRcode掃描結果應該要包含
    // {
    //   "playerId": "1234567890",
    //   "blocks":{ } 分享的板塊內容
    // }
    // 拿到後去打API更新分享的板塊資料
    // 有可能要做身分驗證?
    console.log(data);
  };
  return (
    <>
      <p>板塊頁面</p>
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </>
  );
}
