export interface LotteryItem {
  id: string;
  name: string;
  maxDrawn: number;
  total: number;
}

export interface LotteryPriceList {
  num: number;
  price: number;
}

export interface Lottery {
  type: string;
  lottery_list: { lottery_id: string; is_selected: boolean }[];
}
