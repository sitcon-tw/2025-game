"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useState, useEffect } from "react";
import { Scanner, useDevices, boundingBox } from "@yudiel/react-qr-scanner";

type qrCodeSuccessCallback = (decodedText: string) => void;

const QrCodeScanner = ({
  qrCodeSuccessCallback,
}: {
  qrCodeSuccessCallback: qrCodeSuccessCallback;
}) => {
  const [pause, setPause] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleScan = async (data: string) => {
    setPause(true);
    try {
      if (!qrCodeSuccessCallback) return;
      qrCodeSuccessCallback(data);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setPause(false);
    }
  };

  return (
    <>
      {permissionDenied ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-foreground">
          <div className="text-center text-red-500">
            <h1 className="text-2xl font-bold">攝影機啟動失敗</h1>
            <p className="text-lg">請確認是否有允許存取攝影機權限</p>
          </div>
        </div>
      ) : (
        <Scanner
          formats={[
            "qr_code",
            "micro_qr_code",
          ]}
          onScan={(detectedCodes) => {
            handleScan(detectedCodes[0].rawValue);
          }}
          onError={(error) => {
            setPermissionDenied(true);
          }}
          components={{
            tracker: boundingBox,
            audio: false,
          }}
          styles={{
            container: {
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
          allowMultiple={false}
          scanDelay={5000}
          paused={pause}
        />
      )}
    </>
  );
};

export default QrCodeScanner;
