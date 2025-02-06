type Stamp = {
  type: string;
  isfinished: boolean;
  prizeBlockType?: number;
};

type Achievement = {
  progress: number;
  target: number;
  description: string;
};

const stamps: Stamp[] = [
  { type: "1", isfinished: true, prizeBlockType: 1 },
  { type: "2", isfinished: false },
  { type: "3", isfinished: true, prizeBlockType: 3 },
  { type: "4", isfinished: false },
  { type: "5", isfinished: true, prizeBlockType: 5 },
  { type: "6", isfinished: false },
  { type: "7", isfinished: true, prizeBlockType: 7 },
  { type: "8", isfinished: false },
];

const achievements: Achievement[] = [
  { progress: 1, target: 5, description: "成就1" },
  { progress: 2, target: 5, description: "成就2" },
  { progress: 1, target: 1, description: "成就3" },
  { progress: 0, target: 1, description: "成就4" },
  { progress: 3, target: 5, description: "成就5" },
  { progress: 0, target: 1, description: "成就6" },
  { progress: 4, target: 5, description: "成就7" },
];

export default function AchievementsPage() {
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
            />
          ))}
        </div>

        <div className="flex flex-col gap-8 pr-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.description}
              className="flex items-center gap-4"
            >
              <img
                key={achievement.description}
                src={`https://picsum.photos/id/${index}/50/50`}
                alt={`${index}_achievement`}
              />
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-row justify-between">
                  <p>{achievement.description}</p>
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
      </div>
    </>
  );
}
