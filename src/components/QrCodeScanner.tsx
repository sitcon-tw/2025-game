import { Html5Qrcode } from "html5-qrcode";

import { useEffect, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

type qrCodeSuccessCallback = (decodedText: string) => void;

// 配置掃描器的參數
const config = {
  fps: 10,
  qrbox: { width: 200, height: 200 }, //實際可掃描的區域大小
  aspectRatio: 1,
};

const QrCodeScanner = ({
  qrCodeSuccessCallback,
}: {
  qrCodeSuccessCallback: qrCodeSuccessCallback;
}) => {
  const [cameraId, setCameraId] = useState<string | null>(null);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameraId(devices[0].id);
        }
      })
      .catch((error) => {
        // console.error("Failed to get cameras. ", error);
        console.log("permission denied");

        // TODO::如果有人不給權限 彈出toast 或是彈出提示框再次索取權限
      });
  }, []);

  useEffect(() => {
    if (cameraId) {
      const qrScanner = new Html5Qrcode(qrcodeRegionId); // 綁定掃描器的 DOM 元素
      // qrScanner
      //   .start(cameraId, config, qrCodeSuccessCallback, () => {})
      //   .catch((err) => console.error("Failed to start QR Scanner:", err));

      function successCallback(decodedText: string) {
        if (!qrCodeSuccessCallback) return;
        console.log("decodedText", decodedText);
        qrCodeSuccessCallback(decodedText);
      }

      qrScanner.start(
        { facingMode: "environment" },
        config,
        successCallback,
        () => {},
      );

      return () => {
        console.log("stop");
        qrScanner.stop();
      };
    }
  }, [cameraId]);

  return (
    <>
      {cameraId ? (
        <div id={qrcodeRegionId} />
      ) : (
        <div className="bg-black"></div>
      )}
    </>
  );
  // TODO:: 還沒拿取到cameraId 會出現空白，寫一個skeleton
};

export default QrCodeScanner;
