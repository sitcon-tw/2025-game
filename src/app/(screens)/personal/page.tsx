import { SquareUserRound, UserRound } from "lucide-react";

export default function PersonalPage() {
  return (
    <div className="w-full h-full flex flex-col px-[2rem] pt-[5rem]">
      <div className="bg-[#E5E7EB] w-full h-[4rem] ">
        <div className="flex h-full w-full px-[0.75rem] py-[0.5rem]">
          <div className="flex-initial flex h-full">
            <SquareUserRound className="m-auto" width={"2rem"} height={"2rem"} />
          </div>
          <div className="flex-none flex flex-col pl-[0.75rem] text-left font-bold">
            <div>個人排名：</div>
            <div>團體排名：</div>
          </div>
          <div className="flex-1 flex-col pl-[0.5rem] text-right font-bold">
            <div>1000/2000</div>
            <div>10/99</div>
          </div>
        </div>
      </div>
      <div className="bg-[#E5E7EB] w-full h-[20rem]  mt-[2rem]">
        <div className="flex p-[1rem]">
          <div className="flex">
            <UserRound width={20} height={23} />
            <p className="pl-[0.5rem]">About Me</p>
          </div>
        </div>
      </div>
    </div>
  );
}