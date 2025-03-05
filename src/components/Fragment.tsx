import React from "react";
import { motion } from "framer-motion";
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
    <Image
      src="/images/fragments/a.png"
      alt="板塊 A"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  b: (
    <Image
      src="/images/fragments/b.png"
      alt="板塊 B"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  c: (
    <Image
      src="/images/fragments/c.png"
      alt="板塊 C"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  d: (
    <Image
      src="/images/fragments/d.png"
      alt="板塊 D"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  e: (
    <Image
      src="/images/fragments/e.png"
      alt="板塊 E"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  f: (
    <Image
      src="/images/fragments/f.png"
      alt="板塊 F"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  g: (
    <Image
      src="/images/fragments/g.png"
      alt="板塊 G"
      width={40}
      height={40}
      className="h-full w-full"
    />
  ),
  obstacle: (
    <div className="flex h-full w-full items-center justify-center bg-gray-800 rounded-lg">
      <div className="h-full w-full bg-gray-700 rounded-lg opacity-50" />
    </div>
  ),
  start: (
    <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-purple-500/30 bg-purple-500/20 font-bold text-purple-200">
      Start
    </div>
  ),
  end: (
    <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-green-500/30 bg-green-500/20 font-bold text-green-200">
      End
    </div>
  ),
  unknown: (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-700/50 text-3xl font-bold text-gray-300">
      ?
    </div>
  ),
  empty: (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-800/20" />
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
    <motion.div
      className="relative flex items-end"
      style={{ width: '50px', height: '50px' }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative w-full h-full transition-transform">
        <div className="rounded-lg overflow-hidden">
          {blocks[type]}
        </div>
        {showAmount && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg"
          >
            {amount}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Fragment;
