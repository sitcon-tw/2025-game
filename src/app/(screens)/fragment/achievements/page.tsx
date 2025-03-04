"use client";
import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import { useState } from "react";
import Block from "@/components/Block";

type Stamp = {
  type: string;
  isfinished: boolean;
  prizeBlockType: string;
};

type Achievement = {
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

const achievements: Achievement[] = [
  {
    progress: 1,
    target: 5,
    name: "成就1",
    description: "lorem",
    prizeBlockType: "1",
  },
  {
    progress: 2,
    target: 5,
    name: "成就2",
    description: "lorem",
    prizeBlockType: "2",
  },
  {
    progress: 1,
    target: 1,
    name: "成就3",
    description: "lorem",
    prizeBlockType: "3",
  },
  {
    progress: 0,
    target: 1,
    name: "成就4",
    prizeBlockType: "4",
    description: "lorem",
  },
  {
    progress: 3,
    target: 5,
    name: "成就5",
    prizeBlockType: "5",
    description: "lorem",
  },
  {
    progress: 0,
    target: 1,
    name: "成就6",
    prizeBlockType: "6",
    description: "lorem",
  },
  {
    progress: 4,
    target: 5,
    name: "成就7",
    prizeBlockType: "7",
    description: "lorem",
  },
];

export default function AchievementsPage() {
  const [popupType, setPopupType] = useState<"stamp" | "achievement" | null>(
    null,
  );
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

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
      <div className="relative px-6 pb-6 pt-16">
        <div className="mb-6 grid grid-cols-4 gap-4">
          {stamps.map((stamp) => (
            <img
              key={stamp.type}
              src={`https://picsum.photos/id/${stamp.type}/50/50`}
              alt={`${stamp.type}_stamp`}
              className={`${stamp.isfinished ? "opacity-100" : "opacity-50"}`} // TODO: 替換成icon
              onClick={() => handleStampClick(stamp)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-8 pr-4">
          {achievements.map((achievement, index) => (
            <div key={achievement.name} className="flex items-center gap-4">
              <img
                key={achievement.name}
                src={`https://picsum.photos/id/${index}/50/50`}
                alt={`${index}_achievement`}
                onClick={() => handleAchievementClick(achievement)}
              />
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-row justify-between">
                  <p>{achievement.name}</p>
                  <p>
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
