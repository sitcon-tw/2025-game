"use client";
import Block from "@/components/Block";
import { useQuery } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import usePlayerData from "@/hooks/usePlayerData";
import Fragment from "@/components/Fragment";
import { BlockType } from "@/types/index";

type TeamFragments = Array<{
  name: string;
  fragments: [
    {
      type: BlockType;
      amount: number;
    },
  ];
}>;

export default function SharePage() {
  const token = useToken();

  const { data: teamFragments } = useQuery({
    queryKey: ["fragments", token],
    queryFn: async () => {
      const response = await fetch("/api/fragment/compass?token=" + token);

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: TeamFragments = await response.json();
      return data;
    },
  });

  return (
    <>
      <div className="relative px-4 pb-6 pt-16">
        <div className="flex flex-col gap-2">
          {teamFragments &&
            teamFragments.map((player) => (
              <div key={player.name} className="flex flex-col gap-4 p-2">
                <p>{player.name}的板塊</p>
                <div className="grid grid-cols-4 gap-4">
                  {player.fragments.map((fragment) => (
                    <div
                      className="flex h-full w-full items-center justify-start"
                      key={fragment.type}
                    >
                      <Fragment
                        type={fragment.type}
                        amount={fragment.amount}
                        showAmount={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
