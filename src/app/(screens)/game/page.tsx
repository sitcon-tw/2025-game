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
import usePlayerData from "@/hooks/usePlayerData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FragmentData, PlayerData, StageData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

function getBlockElement(block: string) {
  // const randomRotation = Math.floor(Math.random() * 4) * 90;

  if (block === "obstacle")
    return <div className="brightness-[40%]">{getBlockElement("empty")}</div>;

  return (
    <Image
      src={`/images/fragments/${block}.png`}
      alt="板塊"
      width="300"
      height="300"
    // style={{
    //   transform: `rotate(${randomRotation}deg)`,
    // }}
    />
  );
  return blockAndPropsElements[block as keyof typeof blockAndPropsElements];
}

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
  const [gameGrid, setGameGrid] = useState(createEmptyGrid(5, 5));
  const [PlaceableGrid, setPlaceableGrid] = useState(
    createEmptyPlaceableGrid(5, 5),
  );
  const [SelectedItem, setSelectedItem] = useState("");
  const [IsZoomedIn, setIsZoomedIn] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draggingBlockID, setDraggingBlockID] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingBlockOverMap, setIsDraggingBlockOverMap] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useCustomSensors();
  const rowCount = gameGrid.length;
  const colCount = gameGrid.length > 0 ? gameGrid[0].length : 0;

  const queryClient = useQueryClient();
  const router = useRouter();

  const stageClearMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      console.log("stage clear mutation");
      const response = await fetch("/api/stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: playerData?.token,
          // level: Level,
          // score: Score,
          // gameGrid: gameGrid,
          map: gameGrid,
        }),
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("stage clear data", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("stage clear success");
      queryClient.invalidateQueries({
        queryKey: ["player-data"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fragments", playerData?.token],
      });
      queryClient.invalidateQueries({
        queryKey: ["stage", playerData?.stage],
      });
      const fragmentRemoved = data.fragmentRemoved;
      console.log("fragmentRemoved", fragmentRemoved);
      showDialog(
        "恭喜過關",
        `恭喜你通過了這個關卡！${fragmentRemoved
          ? `但你失去了一個 ${blocksConfig[fragmentRemoved as keyof typeof blocksConfig].name
          } ...`
          : ""
        }`,
      );
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const startRow = gameGrid.findIndex((row) => row.includes("start")) ?? 0;
  const startCol =
    (gameGrid[startRow] && gameGrid[startRow].indexOf("start")) ?? 0;

  /////////////////////////
  //  block a: 橫的
  //  block b: 直的
  //  block c: 十字型
  //  block d: └
  //  block e: ┘
  //  block f: ┌
  //  block g: ┐
  /////////////////////////
  const [BlockData, setBlockData] = useState<Record<string, Block>>({
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

  function placeBlock(row: number, col: number, block: string): boolean {
    const newGrid = gameGrid.map((r) => [...r]);
    if (newGrid[row][col] !== "empty") {
      showDialog("無法放置", "這裡已經有被放置板塊了！");
      return false;
    }
    newGrid[row][col] = block;

    let visited = gameGrid.map((row) => row.map(() => false));
    visited[startRow][startCol] = true;
    const isPathAvailable = dfs(newGrid, startRow, startCol, visited, true);
    if (!isPathAvailable) {
      showDialog("無法放置", "你不能把路堵死！！");
      return false;
    }

    // check for stage clear
    visited = gameGrid.map((row) => row.map(() => false));
    visited[startRow][startCol] = true;
    const isStageClear = dfs(newGrid, startRow, startCol, visited, false);
    console.log("isStageClear", isStageClear);
    if (isStageClear) {
      console.log("level clear");
      stageClearMutation.mutate();
    }

    setGameGrid(newGrid);
    return true;
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
      findPlaceableGrids(up, down, left, right, gameGrid, BlockData);
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
    const newGrid = gameGrid.map((r) => [...r]);
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

  const {
    playerData,
    isLoading: isPlayerDataLoading,
    isError: isPlayerDataError,
    error: playerDataError,
  } = usePlayerData();

  const { data: fragments, isLoading: isFragmentsLoading } = useQuery({
    queryKey: ["fragments", playerData?.token],
    queryFn: async () => {
      const response = await fetch("/api/fragment?token=" + playerData?.token);

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: FragmentData = await response.json();
      return data;
    },
  });

  const {
    data: stageData,
    isLoading: isStageLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stage", playerData?.stage],
    queryFn: async () => {
      const response = await fetch("/api/stage?token=" + playerData?.token);

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: StageData = await response.json();
      return data;
    },
  });

  function showDialog(title: string, content: string) {
    setDialogTitle(title);
    setDialogContent(content);
    setIsDialogOpen(true);
  }

  const emptyMap = Array(5).fill(Array(5).fill("empty"));
  const stageMap = stageData?.map ?? emptyMap;

  const fragmentsString = JSON.stringify(fragments ?? []);
  const stageMapString = JSON.stringify(stageMap);
  // fetch data here
  useEffect(() => {
    // use fake data first. use api after available.
    const LevelData = 1;
    const ScoreData = 12345678;

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

    const allFragments = Object.entries(blocksConfig).map(([key, value]) => ({
      type: key,
      amount: 0,
    }));

    const gameGridData = JSON.parse(stageMapString);
    const fragmentsData: FragmentData = JSON.parse(fragmentsString);
    const formattedFragmentData = [...allFragments, ...fragmentsData]
      .map((fragment) => {
        const fragmentDetails =
          blocksConfig[fragment.type as keyof typeof blocksConfig];
        return {
          unlocked: true,
          type: fragment.type,
          amount: fragment.amount,
          up: fragmentDetails.up,
          down: fragmentDetails.down,
          left: fragmentDetails.left,
          right: fragmentDetails.right,
        };
      })
      .reduce(
        (acc, fragment) => {
          acc[fragment.type] = fragment;
          return acc;
        },
        {} as Record<string, Block>,
      );

    setLevel(LevelData);
    setScore(ScoreData);
    setGameGrid(gameGridData);
    setBlockData(formattedFragmentData);
    setPropsData(PropsDataFetch);
    setPlaceableGrid(
      createEmptyPlaceableGrid(gameGridData.length, gameGridData[0].length),
    );
  }, [fragmentsString, stageMapString]);

  const showZoomButton = gameGrid.length > 5 || gameGrid[0].length > 5;

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
      const successful = placeBlock(
        Number(overRow),
        Number(overCol),
        fragmentID,
      );
      if (successful) {
        addBlockAmount(fragmentID, -1);
      }
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
    // TODO: 待道具功能完成後再加入
    // ...Object.entries(PropsData).map(([key, data]) => ({
    //   data,
    //   id: key,
    // })),
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
    console.log("drag start", fragmentID);
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
              className="pointer-events-none absolute z-10 border-2 border-gray-300"
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
              {getBlockElement(draggingBlockID)}
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
                <p>{playerData?.stage ?? 1}</p>
              </div>
              <div className="flex">
                <p>點數：</p>
                <p>{playerData?.score ?? 0}</p>
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
                <Info
                  className="hover:cursor-pointer"
                  onClick={() => { router.push("/tutorial") }}
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
              className={cn(
                `flex flex-col justify-center overflow-auto border border-gray-300 transition-opacity`,
                {
                  "opacity-50": isLoading,
                },
              )}
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
                {gameGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className={cn("flex", "justify-start")}>
                    {row.map((cell, colIndex) => {
                      const cellContent = getBlockElement(cell);
                      return (
                        <div key={colIndex}>
                          <GameMapGridCell
                            isDragging={isDragging}
                            // setIsDraggingBlockOverMap={setIsDraggingBlockOverMap}
                            cellType={cell}
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
                "flex w-screen items-start gap-4 overflow-x-scroll bg-transparent px-6 py-9 text-foreground transition",
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
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: isDialogOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex w-2/3 flex-col items-center gap-2 rounded-lg bg-primary p-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <div className="text-2xl font-bold">{dialogTitle}</div>
              <div className="text-lg">
                <p>{dialogContent}</p>
              </div>
              <button
                className="mt-4 rounded-lg bg-secondary px-4 py-2 text-foreground"
                onClick={() => setIsDialogOpen(false)}
              >
                完成
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  cellType,
  colCount,
  isDropped,
  isDragging,
}: {
  IsZoomedIn: boolean;
  rowIndex: number;
  isDragging: boolean;
  colIndex: number;
  cellContent: ReactNode;
  cellType: string;
  PlaceableGrid: boolean[][];
  isDropped: boolean;
  rowCount: number;
  colCount: number;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `grid,${rowIndex},${colIndex}`,
  });

  const maxSideCount = Math.max(rowCount, colCount);
  const isPlaceable = cellType === "empty";

  return (
    <div
      ref={setNodeRef}
      className={`border-gray-300"} relative border ease-in-out`}
      style={{
        height: IsZoomedIn ? "64px" : `${GAME_MAP_SIZE / maxSideCount}px`,
        width: IsZoomedIn ? "64px" : `${GAME_MAP_SIZE / maxSideCount}px`,
      }}
      onClick={() => {
        if (PlaceableGrid[rowIndex][colIndex]) {
        }
      }}
    >
      {/* isOver && !isDropped */}
      {
        <div
          className={cn(
            `absolute inset-0 z-10 opacity-0 transition-opacity`,
            {
              "opacity-50": !isPlaceable && isDragging,
            },
            cellType === "start" || cellType === "end"
              ? "bg-yellow-500"
              : cellType === "obstacle"
                ? "bg-red-500"
                : "bg-blue-500",
          )}
        ></div>
      }
      {
        <div
          className={cn(
            `absolute inset-0 z-10 bg-green-500 opacity-0 transition-opacity`,
            {
              "opacity-50":
                isOver && !isDropped && !(!isPlaceable && isDragging),
            },
          )}
        ></div>
      }
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
        <div className="pointer-events-none absolute inset-0 bottom-0 left-0 top-0 border-2 border-gray-300 opacity-50">
          {data.unlocked && getBlockElement(id)}
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
            className={cn(
              `relative border-2 border-gray-300`,
              !isDisabled && "transition-all",
            )}
            style={scaleStyle}
          >
            {data.unlocked
              ? getBlockElement(id)
              : blockAndPropsElements.unknown}
          </div>
        </div>
      </div>
      <div
        className={
          data.unlocked
            ? data.amount > 0
              ? "text-foreground"
              : "text-red-400"
            : "text-foreground"
        }
      >
        x{data.amount}
      </div>
    </div>
  );
}
