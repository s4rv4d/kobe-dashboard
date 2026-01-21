export interface Contribution {
  address: string;
  total_inv_usd: number;
  equity_perc: number;
}

export interface XirrEntry {
  id: number;
  date: string;
  amount: number;
}

export interface ConfigSetting {
  key: string;
  value: string;
  updated_at?: string;
}
