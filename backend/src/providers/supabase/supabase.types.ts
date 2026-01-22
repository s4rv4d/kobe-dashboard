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

export interface Donation {
  id: string;
  address: string;
  username: string | null;
  transaction_date: string;
  contribution_amount: number;
  currency: string;
  eth_price_usd: number;
  usd_donate_value: number;
  total_contribution: number;
  funding_round_id: string | null;
}
