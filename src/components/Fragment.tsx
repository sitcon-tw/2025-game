import React from "react";
import Image from "next/image";
type BlockType =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "obstacle"
  | "start"
  | "end"
  | "unknown"
  | "empty";

type block = {
  type: BlockType;
  amount: number;
};

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

export const Fragment = ({
  type,
  amount,
  showAmount,
}: {
  type: BlockType;
  amount: number;
  showAmount?: boolean;
}) => {
  return (
    <div className="relative flex max-h-[50px] max-w-[50px] items-end">
      {blocks[type]}
      {showAmount && (
        <p className="absolute -right-2 bottom-0 translate-x-[100%]">
          * {amount}
        </p>
      )}
    </div>
  );
};

export default Fragment;
