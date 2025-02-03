import React from "react";
import Image from "next/image";
type block = {
  type: string;
  quentity: number;
};

const Block = ({ type, quentity }: block) => {
  return (
    <div className="flex items-end">
      <img src="https://picsum.photos/50/50" alt={`${type}_block`} />
      <p>*{quentity}</p>
    </div>
  );
};

export default Block;
