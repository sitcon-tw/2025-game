"use client";
import { QRCodeSVG } from "qrcode.react";
import { Store, Waypoints, X } from "lucide-react";
import { useState } from "react";
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

  return (
    <>
      <div className="relative p-6 pt-8">
        <div className="flex flex-col gap-8 pr-4">
          {achievements.map((achievement, index) => (
            <div key={achievement.name} className="flex items-center gap-4">
              <Store className="h-[50px] w-[50px]" />
              <div className="flex w-full flex-col gap-1 overflow-hidden">
                <div className="flex flex-row flex-nowrap justify-between gap-3 overflow-hidden">
                  <p className="overflow-hidden text-ellipsis text-nowrap">
                    {achievement.name}
                  </p>
                  <p className="text-ellipsis text-nowrap">
                    {achievement.progress} / {achievement.target}
                  </p>
                </div>
                <div className="h-4 w-full rounded-full bg-gray-300">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${(achievement.progress / achievement.target) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {popupType === "stamp" && stamp && (
          <StampPopup
            stamp={stamp}
            closePopup={() => setPopupType(null)}
            playerId="123" //TODO: 需要找到時機fetch本地玩家id
          />
        )}
        {popupType === "achievement" && achievement && (
          <AchievementPopup
            achievement={achievement}
            closePopup={() => setPopupType(null)}
          />
        )}
      </div>
    </>
  );
}

const StampPopup = ({
  stamp,
  closePopup,
  playerId,
}: {
  stamp: Stamp;
  closePopup: () => void;
  playerId: string;
}) => {
  return (
    <>
      {stamp && (
        <div className="absolute left-1/2 top-1/2 z-50 flex h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-lg border-2 border-[#6558f5] bg-white p-4 shadow-lg">
          <X onClick={closePopup} className="absolute right-2 top-2" />
          {!stamp.isfinished && (
            <div className="flex h-full w-full flex-col items-center gap-4 py-4">
              <h3>將QRcode給攤位工作人員即可獲得獎勵方塊!</h3>
              <QRCodeSVG width={200} height={200} value={playerId} />
            </div>
          )}
          {stamp.isfinished && (
            <div className="flex flex-col gap-4">
              <h3>這是你的獎勵方塊</h3>
              <Block type={stamp.prizeBlockType} quantity={1} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const AchievementPopup = ({
  achievement,
  closePopup,
}: {
  achievement: Achievement;
  closePopup: () => void;
}) => {
  return (
    <>
      {achievement && (
        <div className="absolute left-1/2 top-1/2 z-50 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg border-2 border-[#6558f5] bg-white p-8 shadow-lg">
          <X onClick={closePopup} className="absolute right-2 top-2" />
          {achievement.progress !== achievement.target && (
            <div className="flex h-full w-full flex-col items-center gap-4 py-4">
              <h3>
                {achievement.name} {achievement.progress} / {achievement.target}
              </h3>
              <p>{achievement.description}</p>
            </div>
          )}
          {achievement.progress === achievement.target && (
            <div className="flex flex-col gap-4">
              <h3>這是你的獎勵方塊</h3>
              <Block type={achievement.prizeBlockType} quantity={1} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
