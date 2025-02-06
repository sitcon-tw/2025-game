import React from "react";
import Image from "next/image";
type block = {
  type: string;
  quantity: number;
};

const Block = ({ type, quantity }: block) => {
  return (
    <div className="relative flex min-h-[50px] min-w-[50px] items-end">
      <img
        src={`https://picsum.photos/id/${type}/50/50`}
        alt={`${type}_block`}
      />
      <p className="absolute bottom-0 right-0 translate-x-[100%]">
        *{quantity}
      </p>
    </div>
  );
};

export default Block;
