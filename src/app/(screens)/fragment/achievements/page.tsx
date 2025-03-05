"use client";
import { QRCodeSVG } from "qrcode.react";
import { Trophy, Medal, Store, Waypoints, X, Check, Lock, QrCode, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Block from "@/components/Block";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/const";
import { sha1 } from "js-sha1";
import useToken from "@/hooks/useToken";
import achievementsConfig from "@/config/achievements.json";

type Stamp = {
  type: string;
  isfinished: boolean;
  prizeBlockType: string;
};

type Achievement = {
  id: string;
  progress: number;
  target: number;
  name: string;
  description: string;
  prizeBlockType: string;
};

const stamps: Stamp[] = [
  { type: "1", isfinished: true, prizeBlockType: "1" },
  { type: "2", isfinished: false, prizeBlockType: "2" },
  { type: "3", isfinished: true, prizeBlockType: "3" },
  { type: "4", isfinished: false, prizeBlockType: "4" },
  { type: "5", isfinished: true, prizeBlockType: "5" },
  { type: "6", isfinished: false, prizeBlockType: "6" },
  { type: "7", isfinished: true, prizeBlockType: "7" },
  { type: "8", isfinished: false, prizeBlockType: "8" },
];

const defaultAchievements: Achievement[] = Object.entries(
  achievementsConfig,
).map(([key, value]) => ({
  progress: 0,
  target: value.target,
  name: value.name,
  description: "",
  prizeBlockType: "",
  id: key,
}));

export default function AchievementsPage() {
  const [popupType, setPopupType] = useState<"stamp" | "achievement" | null>(
    null,
  );
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const token = useToken() ?? "";
  const { data: boothList } = useQuery({
    queryKey: ["boothList"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/event/puzzle/deliverers`);
      const data = response.json();
      return data;
    },
  });
  const { data: boothStamps } = useQuery({
    queryKey: ["boothStamps"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/event/puzzle?token=${sha1(token)}`,
      );
      const data = await response.json();
      return data.deliverers.map(
        (deliverer: { deliverer: string }) => deliverer.deliverer,
      );
    },
  });

  const { data: achievementStatus } = useQuery({
    queryKey: ["achievements", token],
    queryFn: async () => {
      const response = await fetch(`/api/achievement?token=${token}`);
      return response.json();
    },
  });

  console.log("achievementStatus", achievementStatus);

  const achievements: Achievement[] = [
    ...(boothList?.map((booth: string) => ({
      progress:
        boothStamps?.filter((stamp: string) => stamp === booth).length ?? 0,
      target: 1,
      name: `與攤位 ${booth} 互動`,
      description: "lorem",
      prize: "1",
    })) ?? []),
    ...defaultAchievements.map((achievement, index) => ({
      ...achievement,
      progress:
        achievementStatus?.find(
          (status: { id: string }) => status.id === achievement.id,
        )?.current ?? 0,
    })),
  ];

  const handleStampClick = (stamp: Stamp) => {
    setStamp(stamp);
    setPopupType("stamp");
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setAchievement(achievement);
    setPopupType("achievement");
  };

  const closePopup = () => {
    setPopupType(null);
    setStamp(null);
    setAchievement(null);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="sticky top-0 z-10 bg-gray-900/80 p-4 backdrop-blur">
        <h1 className="mb-2 text-2xl font-bold text-white">成就系統</h1>
        <div className="flex gap-2">
          <span className="rounded-full bg-blue-900 px-3 py-1 text-sm text-blue-300">
            <Trophy className="mr-1 inline h-4 w-4" />
            活動成就
          </span>
          <span className="rounded-full bg-green-900 px-3 py-1 text-sm text-green-300">
            <Store className="mr-1 inline h-4 w-4" />
            攤位收集
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4">
          {achievements.map((achievement) => {
            const isCompleted = achievement.progress >= achievement.target;
            return (
              <div
                key={achievement.name}
                onClick={() => handleAchievementClick(achievement)}
                className={`transform cursor-pointer rounded-xl border bg-gray-800 p-4 transition hover:scale-[1.02] hover:shadow-md ${isCompleted
                  ? "border-green-700 bg-green-900/20"
                  : "border-gray-700"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-3 ${isCompleted
                      ? "bg-green-900 text-green-300"
                      : "bg-gray-700 text-gray-300"
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-white">{achievement.name}</h3>
                      <span
                        className={`text-sm ${isCompleted ? "text-green-300" : "text-gray-300"
                          }`}
                      >
                        {achievement.progress} / {achievement.target}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                      <div
                        className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-400" : "bg-blue-400"
                          }`}
                        style={{
                          width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup Overlays */}
      {(popupType === "stamp" || popupType === "achievement") && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      )}

      {popupType === "stamp" && stamp && (
        <div
          ref={modalRef}
          className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-xl border-2 border-[#6558f5] bg-gray-800 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closePopup}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
          {!stamp.isfinished ? (
            <div className="flex flex-col items-center gap-6 py-4">
              <h3 className="text-center text-lg font-semibold text-white">
                掃描 QR Code 以獲得獎勵方塊！
              </h3>
              <div className="rounded-xl bg-gray-700 p-4 shadow-md">
                <QRCodeSVG width={200} height={200} value={token} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <Medal className="h-12 w-12 text-yellow-500" />
              <h3 className="text-xl font-semibold text-white">恭喜獲得獎勵方塊！</h3>
              <Block type={stamp.prizeBlockType} quantity={1} />
            </div>
          )}
        </div>
      )}

      {popupType === "achievement" && achievement && (
        <div
          ref={modalRef}
          className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-xl border-2 border-[#6558f5] bg-gray-800 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closePopup}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
          {achievement.name.includes("與攤位") ? (
            // 攤位互動成就的特殊設計
            <div className="flex flex-col items-center gap-6 py-4">
              <Store className="h-16 w-16 text-purple-400" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {achievement.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-purple-300 mb-4">
                  <QrCode className="h-4 w-4" />
                  <span className="text-sm">掃描 QR Code 完成互動</span>
                </div>
              </div>

              <div className="w-full rounded-lg bg-gray-700/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">完成進度</span>
                  <span className="font-mono text-purple-300">
                    {achievement.progress} / {achievement.target}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${(achievement.progress / achievement.target) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {achievement.progress === 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ArrowRight className="h-4 w-4" />
                  <span>找到攤位工作人員完成互動</span>
                </div>
              )}
            </div>
          ) : (
            // 其他成就的原有設計
            <div className="flex flex-col items-center gap-4 py-4">
              <Trophy className="h-12 w-12 text-blue-400" />
              <h3 className="text-center text-lg font-semibold text-white">
                {achievement.name}
              </h3>
              <p className="text-center text-gray-300">
                進度：{achievement.progress} / {achievement.target}
              </p>
              <p className="text-center text-sm text-gray-400">
                {achievement.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
