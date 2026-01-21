import { z } from 'zod';

export const vaultStatsResponseSchema = z.object({
  currentValue: z.number(),
  investedAmount: z.number(),
  multiple: z.number(),
  xirr: z.number().or(z.null()),
});

export const contributorSchema = z.object({
  address: z.string(),
  investedAmount: z.number(),
  currentValue: z.number(),
  equityPercent: z.number(),
  multiple: z.number(),
});

export const contributionsResponseSchema = z.object({
  contributors: z.array(contributorSchema),
  total: z.number(),
});

export type VaultStatsResponse = z.infer<typeof vaultStatsResponseSchema>;
export type ContributorResponse = z.infer<typeof contributorSchema>;
export type ContributionsResponse = z.infer<typeof contributionsResponseSchema>;
