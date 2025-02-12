"use client";

import React, { useState, useEffect } from "react";
import { LogOut, Info } from "lucide-react";

export default function GamePage() {
  // react usestate -- dont change anything here!
  const [Level, setLevel] = useState(1);
  const [Score, setScore] = useState(0);
  const [GameGrid, setGameGrid] = useState(createEmptyGrid(5, 5));

  function createEmptyGrid(rows: number, cols: number) {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
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

  // blocks in svg format
  const blocks = {
    a: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <line x1="20" y1="0" x2="20" y2="40" stroke="#0EA5E9" strokeWidth="4" />
      </svg>
    ),
    b: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <line x1="0" y1="20" x2="40" y2="20" stroke="#0EA5E9" strokeWidth="4" />
      </svg>
    ),
    c: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <line x1="0" y1="20" x2="40" y2="20" stroke="#0EA5E9" strokeWidth="4" />
        <line x1="20" y1="0" x2="20" y2="40" stroke="#0EA5E9" strokeWidth="4" />
      </svg>
    ),
    d: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path
          d="M20,0 L20,20 L40,20"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="4"
        />
      </svg>
    ),
    e: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path
          d="M20,0 L20,20 L0,20"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="4"
        />
      </svg>
    ),
    f: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path
          d="M20,40 L20,20 L40,20"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="4"
        />
      </svg>
    ),
    g: (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path
          d="M20,40 L20,20 L0,20"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="4"
        />
      </svg>
    ),
  };

  // fetch data here
  useEffect(() => {
    // use fake data first. use api after available.
    const LevelData = 1;
    const ScoreData = 0;
    const GameGridData = createEmptyGrid(5, 5);
    const BlockDataFetch = {
      a: {
        unlocked: true,
        amount: 5,
      },
      b: {
        unlocked: false,
        amount: 6,
      },
      c: {
        unlocked: false,
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
        unlocked: false,
        amount: 7,
      },
      g: {
        unlocked: false,
        amount: 1,
      },
    };

    setLevel(LevelData);
    setScore(ScoreData);
    setGameGrid(GameGridData);
    setBlockData(BlockDataFetch);
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

        <div className="py-4" />

        {/* grid part */}
        <div className="inline-block border border-gray-300">
          {GameGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className="min-h-16 min-w-16 border border-gray-300"
                  onClick={() => updateValue(rowIndex, colIndex, "block")}
                >
                  {cell.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
