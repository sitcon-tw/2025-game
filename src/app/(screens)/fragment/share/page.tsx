import Block from "@/components/Block";

const myBlocks = [
  {
    type: "0",
    quantity: 1,
  },
  {
    type: "1",
    quantity: 2,
  },
  {
    type: "2",
    quantity: 3,
  },
  {
    type: "3",
    quantity: 4,
  },
  {
    type: "4",
    quantity: 1,
  },
  {
    type: "5",
    quantity: 1,
  },
  {
    type: "6",
    quantity: 1,
  },
  {
    type: "7",
    quantity: 1,
  },
];

const planBlocks = [
  { playerName: "kevin", blocks: myBlocks },
  { playerName: "nelson", blocks: myBlocks },
  { playerName: "pizza", blocks: myBlocks },
  { playerName: "dada", blocks: myBlocks },
  { playerName: "naruko", blocks: myBlocks },
];

export default function SharePage() {
  return (
    <>
      <div className="relative px-4 pb-6 pt-16">
        <div className="flex flex-col gap-4 p-2">
          <p>我的板塊</p>
          <div className="grid grid-cols-4 gap-4">
            {myBlocks.map((block) => (
              <div
                className="flex h-full w-full items-center justify-start"
                key={block.type}
              >
                <Block type={block.type} quantity={block.quantity} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {planBlocks.map((planBlocks) => (
            <div
              key={planBlocks.playerName}
              className="flex flex-col gap-4 p-2"
            >
              <p>{planBlocks.playerName}的板塊</p>
              <div className="grid grid-cols-4 gap-4">
                {planBlocks.blocks.map((planBlock) => (
                  <div
                    className="flex h-full w-full items-center justify-start"
                    key={planBlock.type}
                  >
                    <Block
                      type={planBlock.type}
                      quantity={planBlock.quantity}
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
