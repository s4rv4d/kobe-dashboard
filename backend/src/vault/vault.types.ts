// Re-export Zod-inferred types as single source of truth
export type {
  VaultStatsResponse as VaultStats,
  ContributorResponse as ContributorInfo,
  ContributionsResponse,
} from './dto/vault.dto';

export interface CashFlow {
  date: Date;
  amount: number;
}
