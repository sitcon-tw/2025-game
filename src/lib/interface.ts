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

export interface ErrorCardProps {
  title?: string;
  errorItems?: ErrorItem[];
  onReload?: () => void;
}

export interface ErrorItem {
  icon: React.ReactNode;
  label: string;
  message: string;
}