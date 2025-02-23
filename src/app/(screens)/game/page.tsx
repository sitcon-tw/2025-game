"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import blocksConfig from "@/config/blocks.json";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  LogOut,
  Info,
  ArrowDownUp,
  RotateCcwSquare,
  Bomb,
  SquareArrowOutUpRight,
  Scan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useCustomSensors from "@/hooks/useCustomSensors";
import { dfs } from "@/utils/dfs";

const BLOCK_SIZE = 56;
const GAME_MAP_SIZE = 320;

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
      <path d="M20,0 L20,20 L0,20" fill="none" stroke="white" strokeWidth="4" />
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
    <div className="flex h-full w-full items-center justify-center bg-zinc-50"></div>
  ),
};

const props = {
  switchFloor: (
    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-600">
      <ArrowDownUp className="h-10 w-10" />
    </div>
  ),
  rotate: (
    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-600">
      <RotateCcwSquare className="h-10 w-10" />
    </div>
  ),
  bomb: (
    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-600">
      <Bomb className="h-10 w-10" />
    </div>
  ),
  teleport: (
    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-600">
      <SquareArrowOutUpRight className="h-10 w-10" />
    </div>
  ),
};

const blockAndPropsElements = {
  ...blocks,
  ...props,
};

interface Block {
  unlocked: boolean;
  amount: number;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface Prop {
  unlocked: boolean;
  amount: number;
}
interface InventoryItem {
  data: Block | Prop;
  id: string;
}

export default function GamePage() {
  // react usestate -- dont change anything here!
  const [Level, setLevel] = useState(1);
  const [Score, setScore] = useState(0);
  const [GameGrid, setGameGrid] = useState(createEmptyGrid(5, 5));
  const [PlaceableGrid, setPlaceableGrid] = useState(
    createEmptyPlaceableGrid(5, 5),
  );
  const [SelectedItem, setSelectedItem] = useState("");
  const [IsZoomedIn, setIsZoomedIn] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [draggingBlockID, setDraggingBlockID] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingBlockOverMap, setIsDraggingBlockOverMap] = useState(false);
  const sensors = useCustomSensors();
  const rowCount = GameGrid.length;
  const colCount = GameGrid.length > 0 ? GameGrid[0].length : 0;

  const startRow = GameGrid.findIndex((row) => row.includes("start")) ?? 0;
  const startCol =
    (GameGrid[startRow] && GameGrid[startRow].indexOf("start")) ?? 0;

  /////////////////////////
  //  block a: 橫的
  //  block b: 直的
  //  block c: 十字型
  //  block d: └
  //  block e: ┘
  //  block f: ┌
  //  block g: ┐
  /////////////////////////
  const [BlockData, setBlockData] = useState({
    a: {
      unlocked: false,
      amount: 0,
      up: false,
      down: false,
      left: true,
      right: true,
    },
    b: {
      unlocked: false,
      amount: 0,
      up: true,
      down: true,
      left: false,
      right: false,
    },
    c: {
      unlocked: false,
      amount: 0,
      up: true,
      down: true,
      left: true,
      right: true,
    },
    d: {
      unlocked: false,
      amount: 0,
      up: true,
      down: false,
      left: false,
      right: true,
    },
    e: {
      unlocked: false,
      amount: 0,
      up: true,
      down: false,
      left: true,
      right: false,
    },
    f: {
      unlocked: false,
      amount: 0,
      up: false,
      down: true,
      left: false,
      right: true,
    },
    g: {
      unlocked: false,
      amount: 0,
      up: false,
      down: true,
      left: true,
      right: false,
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

  function createEmptyGrid(rows: number, cols: number) {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("empty"));
  }

  function placeBlock(row: number, col: number, block: string) {
    const newGrid = GameGrid.map((r) => [...r]);
    newGrid[row][col] = block;

    const visited = GameGrid.map((row) => row.map(() => false));
    visited[startRow][startCol] = true;
    const isPathAvailable = dfs(newGrid, startRow, startCol, visited, false);
    if (!isPathAvailable) {
      alert("你不能把路徑堵死！");
      return;
    }

    setGameGrid(newGrid);
  }

  function createEmptyPlaceableGrid(rows: number, cols: number) {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));
  }

  function toggleZoom() {
    setIsZoomedIn(!IsZoomedIn);
  }

  function selectBlock(block: string) {
    setSelectedItem(block);
    if (
      BlockData[block as keyof typeof BlockData].amount == 0 ||
      !BlockData[block as keyof typeof BlockData].unlocked
    ) {
      setTimeout(() => {
        setSelectedItem("");
      }, 400);
    } else {
      const { up, down, left, right } =
        BlockData[block as keyof typeof BlockData];
      findPlaceableGrids(up, down, left, right, GameGrid, BlockData);
    }
  }

  function selectProp(prop: string) {
    setSelectedItem(prop);
    if (
      PropsData[prop as keyof typeof PropsData].amount == 0 ||
      !PropsData[prop as keyof typeof PropsData].unlocked
    ) {
      setTimeout(() => {
        setSelectedItem("");
      }, 400);
    }
  }

  function updateValue(
    row: string | number,
    col: string | number,
    value: string,
  ) {
    const newRow = typeof row === "string" ? Number(row) : row;
    const newCol = typeof col === "string" ? Number(col) : col;
    const newGrid = GameGrid.map((r) => [...r]);
    newGrid[newRow][newCol] = value;
    setGameGrid(newGrid);
  }

  function updatePlaceableGrid(
    row: string | number,
    col: string | number,
    value: boolean,
  ) {
    const newRow = typeof row === "string" ? Number(row) : row;
    const newCol = typeof col === "string" ? Number(col) : col;
    const newGrid = PlaceableGrid.map((r) => [...r]);
    newGrid[newRow][newCol] = value;
    setPlaceableGrid(newGrid);
  }

  function addBlockAmount(block: string, amount: number) {
    const newBlockData = { ...BlockData };
    newBlockData[block as keyof typeof BlockData].amount += amount;
    setBlockData(newBlockData);
  }

  function findPlaceableGrids(
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    gameGrid: string[][],
    blockData: typeof BlockData,
  ) {
    const rows = gameGrid.length;
    const cols = gameGrid[0].length;
    const newGrid = Array(rows)
      .fill(false)
      .map(() => Array(cols).fill(false));

    // Helper function to check if two blocks can connect
    function canConnect(
      block1: string,
      block2: string,
      direction: "up" | "down" | "left" | "right",
    ): boolean {
      if (block1 === "empty" || block2 === "empty") return false;

      const data1 = blockData[block1 as keyof typeof blockData];
      const data2 = blockData[block2 as keyof typeof blockData];

      if (!data1 || !data2) return false;

      switch (direction) {
        case "up":
          return data1.up && data2.down;
        case "down":
          return data1.down && data2.up;
        case "left":
          return data1.left && data2.right;
        case "right":
          return data1.right && data2.left;
      }
    }

    type Position = {
      i: number;
      j: number;
    };

    // Helper function to check if placing a block would create a dead end
    function wouldCreateDeadEnd(pos: Position, blockType: string): boolean {
      const connections = {
        up:
          pos.i > 0
            ? canConnect(blockType, gameGrid[pos.i - 1][pos.j], "up")
            : false,
        down:
          pos.i < rows - 1
            ? canConnect(blockType, gameGrid[pos.i + 1][pos.j], "down")
            : false,
        left:
          pos.j > 0
            ? canConnect(blockType, gameGrid[pos.i][pos.j - 1], "left")
            : false,
        right:
          pos.j < cols - 1
            ? canConnect(blockType, gameGrid[pos.i][pos.j + 1], "right")
            : false,
      };

      // Count possible connections
      const possibleConnections = Object.values(connections).filter(
        (v) => v,
      ).length;
      const blockConnections = [up, down, left, right].filter((v) => v).length;

      // If there's only one connection possible and the block has more than one connection point,
      // it would create a dead end
      return possibleConnections === 1 && blockConnections > 1;
    }

    // Check each cell in the grid
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (gameGrid[i][j] === "empty") {
          // Check each adjacent cell
          const adjacentCells = [
            { pos: { i: i - 1, j }, dir: "up" as const, allowed: up },
            { pos: { i: i + 1, j }, dir: "down" as const, allowed: down },
            { pos: { i, j: j - 1 }, dir: "left" as const, allowed: left },
            { pos: { i, j: j + 1 }, dir: "right" as const, allowed: right },
          ];

          // Check if at least one valid connection is possible
          const hasValidConnection = adjacentCells.some(
            ({ pos, dir, allowed }) => {
              if (!allowed) return false;
              if (pos.i < 0 || pos.i >= rows || pos.j < 0 || pos.j >= cols)
                return false;

              const adjacentBlock = gameGrid[pos.i][pos.j];
              return (
                adjacentBlock !== "empty" &&
                canConnect(
                  adjacentBlock,
                  String.fromCharCode(97 + Math.floor(Math.random() * 7)),
                  dir,
                )
              );
            },
          );

          // Set cell as placeable if it has valid connection and wouldn't create dead end
          if (hasValidConnection && !wouldCreateDeadEnd({ i, j }, "a")) {
            newGrid[i][j] = true;
          }
        }
      }
    }
    setPlaceableGrid(newGrid);
  }

  // fetch data here
  useEffect(() => {
    // use fake data first. use api after available.
    const LevelData = 1;
    const ScoreData = 12345678;
    const gameGridData5x5 = [
      ["empty", "start", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "obstacle", "empty", "a", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "end", "a"],
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
      ["empty", "empty", "empty", "empty", "end"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
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
        "end",
        "empty",
        "empty",
        "empty",
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
        amount: 2,
        up: false,
        down: false,
        left: true,
        right: true,
      },
      b: {
        unlocked: true,
        amount: 10,
        up: true,
        down: true,
        left: false,
        right: false,
      },
      c: {
        unlocked: true,
        amount: 10,
        up: true,
        down: true,
        left: true,
        right: true,
      },
      d: {
        unlocked: true,
        amount: 0,
        up: true,
        down: false,
        left: false,
        right: true,
      },
      e: {
        unlocked: true,
        amount: 0,
        up: true,
        down: false,
        left: true,
        right: false,
      },
      f: {
        unlocked: true,
        amount: 0,
        up: false,
        down: true,
        left: false,
        right: true,
      },
      g: {
        unlocked: true,
        amount: 0,
        up: false,
        down: true,
        left: true,
        right: false,
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

    const GameGridData = gameGridData9x9;

    setLevel(LevelData);
    setScore(ScoreData);
    setGameGrid(GameGridData);
    setBlockData(BlockDataFetch);
    setPropsData(PropsDataFetch);
    setPlaceableGrid(
      createEmptyPlaceableGrid(GameGridData.length, GameGridData[0].length),
    );
  }, []);

  const showZoomButton = GameGrid.length > 5 || GameGrid[0].length > 5;

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    setIsDraggingBlockOverMap(false);
    setDraggingBlockID("");
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id.toString().split(",");
    const overId = over.id.toString().split(",");
    const [activeType, fragmentID] = activeId;
    const [overType, overRow, overCol] = overId;

    if (activeType === "fragment" && overType === "grid") {
      placeBlock(Number(overRow), Number(overCol), fragmentID);
      addBlockAmount(fragmentID, -1);
      setIsDropped(true);
    }
  }

  function handleDragOver() {
    setIsDraggingBlockOverMap(true);
  }

  const inventoryItems: InventoryItem[] = [
    ...Object.entries(BlockData).map(([key, data]) => ({
      data,
      id: key,
    })),
    ...Object.entries(PropsData).map(([key, data]) => ({
      data,
      id: key,
    })),
  ].toSorted(
    (a, b) => (b.data.amount > 0 ? 1 : 0) - (a.data.amount > 0 ? 1 : 0),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (!active) return;

    const activeId = active.id.toString().split(",");
    const [activeType, fragmentID] = activeId;

    setDraggingBlockID(fragmentID);
    setIsDropped(false);
    setIsDragging(true);
  }

  return (
    <>
      <DndContext
        onDragOver={handleDragOver}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        {draggingBlockID && !isDropped && (
          <DragOverlay>
            <div
              className="pointer-events-none absolute z-10"
              style={{
                width:
                  isDraggingBlockOverMap && !IsZoomedIn
                    ? GAME_MAP_SIZE / rowCount
                    : BLOCK_SIZE,
                height:
                  isDraggingBlockOverMap && !IsZoomedIn
                    ? GAME_MAP_SIZE / colCount
                    : BLOCK_SIZE,
                display: isDragging ? "block" : "none",
              }}
            >
              {
                blockAndPropsElements[
                  draggingBlockID as keyof typeof blockAndPropsElements
                ]
              }
            </div>
          </DragOverlay>
        )}
        <div
          className={cn(
            "flex h-full w-full flex-col items-center overflow-hidden py-4",
          )}
        >
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
              {showZoomButton && (
                <Scan
                  className="hover:scale-110 active:scale-95"
                  onClick={toggleZoom}
                  size={32}
                />
              )}
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
          <div className="py-3" />
          {/* game area */}
          <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
            {/* grid part */}
            <div
              className={`flex flex-col justify-center overflow-auto border border-gray-200`}
              style={{
                width: IsZoomedIn
                  ? `${GAME_MAP_SIZE + 2}px`
                  : `${GAME_MAP_SIZE + 2}px`,
                height: IsZoomedIn
                  ? `${GAME_MAP_SIZE + 2}px`
                  : `${GAME_MAP_SIZE + 2}px`,
                minHeight: IsZoomedIn
                  ? `${GAME_MAP_SIZE + 2}px`
                  : `${GAME_MAP_SIZE + 2}px`,
              }}
            >
              <div className="w-full overflow-scroll">
                {GameGrid.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={cn(
                      "flex",
                      rowCount < colCount ? "justify-start" : "justify-center",
                    )}
                  >
                    {row.map((cell, colIndex) => {
                      const cellContent =
                        blockAndPropsElements[
                          cell as keyof typeof blockAndPropsElements
                        ];

                      return (
                        <div key={colIndex}>
                          <GameMapGridCell
                            // setIsDraggingBlockOverMap={setIsDraggingBlockOverMap}
                            IsZoomedIn={IsZoomedIn}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            cellContent={cellContent}
                            PlaceableGrid={PlaceableGrid}
                            isDropped={isDropped}
                            rowCount={rowCount}
                            colCount={colCount}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* inventory */}
            <div
              className={cn(
                "flex w-screen items-start gap-4 overflow-x-scroll bg-green-200 px-6 py-9 transition",
                isDragging ? "opacity-50" : "opacity-100",
              )}
            >
              {/* <div className="flex justify-start gap-4 pb-3"> */}
              {inventoryItems.map(({ data, id }) => (
                <BlockInInventory
                  isOverMap={isDraggingBlockOverMap}
                  width={
                    isDraggingBlockOverMap
                      ? GAME_MAP_SIZE / rowCount
                      : BLOCK_SIZE
                  }
                  height={
                    isDraggingBlockOverMap
                      ? GAME_MAP_SIZE / colCount
                      : BLOCK_SIZE
                  }
                  key={id}
                  id={id}
                  data={data}
                  isDropped={isDropped}
                />
              ))}
              {/* </div> */}
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
}

function GameMapGridCell({
  IsZoomedIn,
  rowIndex,
  colIndex,
  cellContent,
  PlaceableGrid,
  rowCount,
  colCount,
  isDropped,
}: {
  IsZoomedIn: boolean;
  rowIndex: number;
  colIndex: number;
  cellContent: ReactNode;
  PlaceableGrid: boolean[][];
  isDropped: boolean;
  rowCount: number;
  colCount: number;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `grid,${rowIndex},${colIndex}`,
  });

  const maxSideCount = Math.max(rowCount, colCount);

  return (
    <div
      ref={setNodeRef}
      className={`border transition ease-in-out ${isOver && !isDropped ? "animate-pulse border-[4px] border-orange-300 ease-in-out" : ""}`}
      style={{
        height: IsZoomedIn ? "64px" : `${GAME_MAP_SIZE / maxSideCount}px`,
        width: IsZoomedIn ? "64px" : `${GAME_MAP_SIZE / maxSideCount}px`,
        transitionProperty: "height, width",
      }}
      onClick={() => {
        if (PlaceableGrid[rowIndex][colIndex]) {
          console.log("hi");
        }
      }}
    >
      {cellContent}
    </div>
  );
}

function BlockInInventory({
  isOverMap,
  width,
  height,
  id,
  data,
  isDropped,
}: {
  isOverMap: boolean;
  width: number;
  height: number;
  id: string;
  data: Block | Prop;
  isDropped: boolean;
}) {
  const isDisabled = data.amount <= 0 || !data.unlocked;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `fragment,${id}`,
      disabled: isDisabled,
    });
  const style = transform
    ? {
        // transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
      }
    : undefined;

  const scaleStyle = {
    // transform: isDragging
    //   ? `scaleX(${width / BLOCK_SIZE}) scaleY(${height / BLOCK_SIZE})`
    //   : undefined,
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
  };
  const isMoving =
    Math.abs(transform?.x ?? 0 - 0) != 0 ||
    Math.abs(transform?.y ?? 0 - 0) != 0;

  const needDuration = !isMoving && !isDropped;

  return (
    <div
      key={id}
      className={cn(
        "relative flex items-end justify-start gap-2",
        isDisabled && "opacity-50",
      )}
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bottom-0 left-0 top-0 opacity-50">
          {data.unlocked &&
            blockAndPropsElements[id as keyof typeof blockAndPropsElements]}
        </div>
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className={cn(
            `h-14 w-14 ease-in-out ${isMoving && isDropped ? "hidden" : ""} ${isDragging && "z-10"}`,
            isDisabled ? "cursor-not-allowed" : "cursor-move",
            needDuration && "duration-200",
          )}
        >
          <div
            className={cn(`relative`, !isDisabled && "transition-all")}
            style={scaleStyle}
          >
            {data.unlocked
              ? blockAndPropsElements[id as keyof typeof blockAndPropsElements]
              : blockAndPropsElements.unknown}
          </div>
        </div>
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
  );
}
