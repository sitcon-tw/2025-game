"use client";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import Select from "./Select";
// Override console.error
// This is a hack to suppress the warning about missing defaultProps in react-qr-reader
const error = console.error;
const manual = "manual";

console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

function Scanner({ onResult }: { onResult: (result: string) => void }) {
  useEffect(() => {
    getUserCameraList();
  }, []);
  async function getUserCameraList() {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
    } catch (e) {
      setCurrentCamera(manual);
      console.log(e);
      return;
    }

    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((device) => device.kind == "videoinput");

    setCameras(devices);
    try {
      setCurrentCamera(
        devices.find(async (device) => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: device.deviceId },
          });
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities();
          track.stop();
          return capabilities.facingMode?.includes("environment");
        })?.deviceId ?? devices[0].deviceId,
      );
    } catch (e) {
      console.log(e);
      setCurrentCamera(devices[0].deviceId);
    }
  }

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string>(manual);

  return (
    <div className="relative flex h-full min-h-[396px] w-full items-center justify-center text-center">
      <Select
        onChange={(e) => setCurrentCamera(e.target.value)}
        value={currentCamera || ""}
        className="w-full appearance-none rounded-md bg-white/75 p-2 shadow-md outline-0 backdrop-blur-lg"
        containerClassName="absolute left-0 right-0 top-4 z-[1] w-[256px] m-auto"
      >
        <option value={manual}>手動輸入</option>
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label}
          </option>
        ))}
      </Select>

      <p className="absolute left-0 right-0 top-16 m-auto text-xs">
        若無法使用掃描器，請從上方選單選擇「手動輸入」。
      </p>

      {currentCamera === "manual" ? (
        <Manual onResult={onResult} />
      ) : (
        <FromCamera currentCamera={currentCamera} onResult={onResult} />
      )}
    </div>
  );
}

function Manual({ onResult }: { onResult: (result: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onResult(value);
      }}
      className="bg-sitcon-color8 flex h-full w-full flex-col items-center justify-center gap-4"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        className="rounded-md p-2 px-6 py-4 text-3xl shadow-md outline-0"
        placeholder="Code"
      />
      <button
        className="bg-sitcon-primary rounded-md p-2 px-10 py-4 text-3xl font-bold text-white shadow-md outline-0"
        type="submit"
      >
        確定
      </button>
    </form>
  );
}

function FromCamera({
  currentCamera,
  onResult,
}: {
  currentCamera: string;
  onResult: (result: string) => void;
}) {
  return (
    <QrReader
      key={currentCamera}
      onResult={async (result) => {
        const text = result?.getText();
        if (text) {
          onResult(text);
        }
      }}
      scanDelay={500}
      constraints={{
        deviceId: currentCamera!,
      }}
      videoStyle={{
        objectFit: "cover",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
      videoContainerStyle={{
        height: "100%",
        width: "100%",
        padding: "0",
      }}
      containerStyle={{
        height: "100%",
        width: "100%",
      }}
    />
  );
}

export default Scanner;
