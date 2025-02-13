"use client";

import React, { useState, useEffect } from "react";
import {
  LogOut,
  Info,
  ArrowDownUp,
  RotateCcwSquare,
  Bomb,
  SquareArrowOutUpRight,
  Scan,
} from "lucide-react";

export default function GamePage() {
  // react usestate -- dont change anything here!
  const [Level, setLevel] = useState(1);
  const [Score, setScore] = useState(0);
  const [GameGrid, setGameGrid] = useState(createEmptyGrid(5, 5));
  const [SelectedBlock, setSelectedBlock] = useState("");
  const [IsZoomedIn, setIsZoomedIn] = useState(false);

  function createEmptyGrid(rows: number, cols: number) {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
  }

  function toggleZoom() {
    setIsZoomedIn(!IsZoomedIn);
  }

  const updateGridSize = (rows: number, cols: number) => {
    setGameGrid(createEmptyGrid(rows, cols));
  };

  const updateValue = (
    row: string | number,
    col: string | number,
    value: string,
  ) => {
    const newRow = typeof row === "string" ? Number(row) : row;
    const newCol = typeof col === "string" ? Number(col) : col;
    const newGrid = GameGrid.map((r) => [...r]);
    newGrid[newRow][newCol] = value;
    setGameGrid(newGrid);
  };

  /////////////////////////
  //  block a: 橫的
  //  block b: 直的
  //  block c: 十字型
  //  block d: ┐
  //  block e: └
  //  block f: ┘
  //  block g: ┌
  /////////////////////////
  const [BlockData, setBlockData] = useState({
    a: {
      unlocked: false,
      amount: 0,
    },
    b: {
      unlocked: false,
      amount: 0,
    },
    c: {
      unlocked: false,
      amount: 0,
    },
    d: {
      unlocked: false,
      amount: 0,
    },
    e: {
      unlocked: false,
      amount: 0,
    },
    f: {
      unlocked: false,
      amount: 0,
    },
    g: {
      unlocked: false,
      amount: 0,
    },
  });
  const [PropsData, setPropsData] = useState({
    switchFloor: {
      unlocked: false,
      amount: 0,
    },
    rotate: {
      unlocked: false,
      amount: 0,
    },
    bomb: {
      unlocked: false,
      amount: 0,
    },
    teleport: {
      unlocked: false,
      amount: 0,
    },
  });

  // blocks in svg format
  const blocks = {
    a: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="4" />
      </svg>
    ),
    b: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="4" />
      </svg>
    ),
    c: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="4" />
        <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="4" />
      </svg>
    ),
    d: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <path
          d="M20,0 L20,20 L40,20"
          fill="none"
          stroke="white"
          strokeWidth="4"
        />
      </svg>
    ),
    e: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <path
          d="M20,0 L20,20 L0,20"
          fill="none"
          stroke="white"
          strokeWidth="4"
        />
      </svg>
    ),
    f: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <path
          d="M20,40 L20,20 L40,20"
          fill="none"
          stroke="white"
          strokeWidth="4"
        />
      </svg>
    ),
    g: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect width="40" height="40" fill="#0EA5E9" />
        <path
          d="M20,40 L20,20 L0,20"
          fill="none"
          stroke="white"
          strokeWidth="4"
        />
      </svg>
    ),
    obstacle: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <rect x="0" y="0" width="40" height="40" fill="#333333" />
      </svg>
    ),
    start: (
      <div className="flex h-full w-full items-center justify-center border-2 border-purple-300 bg-purple-200 font-bold text-zinc-500">
        Start
      </div>
    ),
    end: (
      <div className="flex h-full w-full items-center justify-center border-2 border-green-300 bg-green-200 font-bold text-zinc-500">
        End
      </div>
    ),
    unknown: (
      <div className="flex h-full w-full items-center justify-center border-2 border-zinc-400 bg-zinc-500 text-3xl font-bold text-zinc-100">
        ?
      </div>
    ),
    empty: (
      <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-zinc-600"></div>
    ),
  };

  const props = {
    switchFloor: (
      <div className="flex h-14 w-14 items-center justify-center bg-zinc-200 text-zinc-600">
        <ArrowDownUp className="h-10 w-10" />
      </div>
    ),
    rotate: (
      <div className="flex h-14 w-14 items-center justify-center bg-zinc-200 text-zinc-600">
        <RotateCcwSquare className="h-10 w-10" />
      </div>
    ),
    bomb: (
      <div className="flex h-14 w-14 items-center justify-center bg-zinc-200 text-zinc-600">
        <Bomb className="h-10 w-10" />
      </div>
    ),
    teleport: (
      <div className="flex h-14 w-14 items-center justify-center bg-zinc-200 text-zinc-600">
        <SquareArrowOutUpRight className="h-10 w-10" />
      </div>
    ),
  };

  // fetch data here
  useEffect(() => {
    // use fake data first. use api after available.
    const LevelData = 1;
    const ScoreData = 12345678;
    const GameGridData = [
      ["empty", "start", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "obstacle", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "end", "empty"],
    ];
    const gameGridData6x6 = [
      ["start", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "end"],
    ];
    const gameGridData7x7 = [
      ["start", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "end"],
    ];
    const gameGridData8x8 = [
      ["start", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "end"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ];

    const gameGridData9x9 = [
      [
        "start",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "end",
      ],
    ];

    const gameGridData10x10 = [
      [
        "start",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "end",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
      [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ],
    ];
    const BlockDataFetch = {
      a: {
        unlocked: true,
        amount: 5,
      },
      b: {
        unlocked: true,
        amount: 0,
      },
      c: {
        unlocked: true,
        amount: 3,
      },
      d: {
        unlocked: false,
        amount: 4,
      },
      e: {
        unlocked: false,
        amount: 0,
      },
      f: {
        unlocked: true,
        amount: 7,
      },
      g: {
        unlocked: false,
        amount: 1,
      },
    };
    const PropsDataFetch = {
      switchFloor: {
        unlocked: true,
        amount: 5,
      },
      rotate: {
        unlocked: true,
        amount: 0,
      },
      bomb: {
        unlocked: true,
        amount: 0,
      },
      teleport: {
        unlocked: true,
        amount: 4,
      },
    };

    setLevel(LevelData);
    setScore(ScoreData);
    setGameGrid(gameGridData8x8);
    setBlockData(BlockDataFetch);
    setPropsData(PropsDataFetch);
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center py-12">
        {/* header */}
        <div className="flex w-[80%] justify-between">
          <div className="text-2xl">
            <div className="flex">
              <p>關卡：</p>
              <p>{Level}</p>
            </div>
            <div className="flex">
              <p>積分：</p>
              <p>{Score}</p>
            </div>
          </div>

          <div className="flex items-baseline space-x-4">
            <Scan
              className="transition-transform hover:scale-110 active:scale-95"
              onClick={toggleZoom}
              size={32}
            />
            <div>
              <LogOut
                onClick={() => console.log("logout")} // TODO: 登入要做的事?
                size={32}
              />
              <Info
                onClick={() => console.log("info")} // TODO: 顯示遊戲說明
                size={32}
              />
            </div>
          </div>
        </div>

        <div className="py-4" />

        {/* grid part */}
        <div
          className={`inline-block h-[322px] w-[322px] overflow-auto border border-gray-200 ${IsZoomedIn ? "overflow-auto" : ""}`}
        >
          <div className="w-fit">
            {GameGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => {
                  let cellContent;
                  switch (cell) {
                    case "empty":
                      cellContent = blocks.empty;
                      break;
                    case "a":
                      cellContent = blocks.a;
                      break;
                    case "b":
                      cellContent = blocks.b;
                      break;
                    case "c":
                      cellContent = blocks.c;
                      break;
                    case "d":
                      cellContent = blocks.d;
                      break;
                    case "e":
                      cellContent = blocks.e;
                      break;
                    case "f":
                      cellContent = blocks.f;
                      break;
                    case "g":
                      cellContent = blocks.g;
                      break;
                    case "obstacle":
                      cellContent = blocks.obstacle;
                      break;
                    case "start":
                      cellContent = blocks.start;
                      break;
                    case "end":
                      cellContent = blocks.end;
                      break;
                    default:
                      cellContent = <div>Unknown Cell Type</div>;
                      break;
                  }
                  return (
                    <div
                      key={colIndex}
                      className="border border-slate-200 transition-all duration-300 ease-in-out"
                      style={{
                        height: IsZoomedIn ? "64px" : `${320 / row.length}px`,
                        width: IsZoomedIn ? "64px" : `${320 / row.length}px`,
                      }}
                    >
                      {cellContent}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="py-4" />

        {/* blocks */}
        <div className="grid w-[80%] grid-cols-4 justify-between gap-2 pb-3">
          {Object.entries(BlockData).map(([key, data]) => (
            <div key={key} className="flex items-end justify-between">
              <div className="h-14 w-14">
                {data.unlocked
                  ? blocks[key as keyof typeof blocks]
                  : blocks.unknown}
              </div>
              <div
                className={
                  data.unlocked
                    ? data.amount > 0
                      ? "text-black"
                      : "text-red-400"
                    : "text-zinc-400"
                }
              >
                x{data.amount}
              </div>
            </div>
          ))}
        </div>

        {/* props */}
        <div className="grid w-[80%] grid-cols-4 justify-between gap-2">
          {Object.entries(PropsData).map(([key, data]) => (
            <div key={key} className="flex items-end justify-between">
              <div className="h-14 w-14">
                {data.unlocked
                  ? props[key as keyof typeof props]
                  : blocks.unknown}
              </div>
              <div
                className={
                  data.unlocked
                    ? data.amount > 0
                      ? "text-black"
                      : "text-red-400"
                    : "text-zinc-400"
                }
              >
                x{data.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
