import React from "react";
import Image from "next/image";
type block = {
  type: string;
  quentity: number;
};

const Block = ({ type, quentity }: block) => {
  return (
    <div className="relative flex items-end">
      <img src="https://picsum.photos/50/50" alt={`${type}_block`} />
      <p className="absolute bottom-0 right-0 translate-x-[100%]">
        *{quentity}
      </p>
    </div>
  );
};

export default Block;
