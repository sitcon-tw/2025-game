/* ? This is a type file
? You should define all your types here
? Here have an example of how to define a type
? export type typename = { first_var: first_var_type; second_var: second_var_type; };
? You can import type to anywhere like this
? import { typename, playerData } from '@/types';
 */

export type BlockType =
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

export type PlayerData = {
  token: string; //
  name: string; // data.user_id
  avatar?: string; //
  linktree?: string; //
  score: number; //
  stage: number; //
};

// for self fragment & all fragment api
export type FragmentData = Array<{
  type: BlockType; // 板塊類別含障礙物、板塊、傳送門
  amount: number; // 數量
}>;
// for shared fragment & compass api
export type SharedFragmentData = Array<{
  name: string;
  fragments: FragmentData;
  avatar: string | null;
}>;

export type CouponData = {
  couponId?: string; // generate by server
  type?: number; // set discount
  used?: boolean; // default when true can't use
};

export type AchievementData = {
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    target: number; // 須達成的目標數 ex:要跑五個攤位
    progress: number; // 目前的進度: ex:已經跑了三個攤位
    prizeBlockType?: string; // 達成目標後得到的獎勵方塊
  }>;
};

export type BoothData = {
  booths: Array<{
    id: number;
    name: string;
    description: string;
    isFinished: boolean; // 是否已經完成
    prizeBlockType?: string; // 如果已完成，得到的獎勵方塊
  }>;
};

export type TeamMemberData = {
  members: Array<{
    name: string;
    isActivated: boolean; // 是否已啟動指南針計畫
  }>;
};

export type StageData = {
  level: number; // 對該玩家來說是第幾關
  floor: number; // 總層數
  size: number; // 地圖大小 正方形
  map: string[][]; // map[layer][row][column]
};

export type LotteryBoxData = {
  lotteryBox: Array<{
    id: number;
    name: string;
    description: string;
    isFinished: boolean; // 是否已經完成
    prizeBlockType?: string; // 如果已完成，得到的獎勵方塊
  }>;
};
