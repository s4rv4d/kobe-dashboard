import { z } from 'zod';

export const donationSchema = z.object({
  id: z.string(),
  address: z.string(),
  username: z.string().nullable(),
  transactionDate: z.string(),
  contributionAmount: z.number(),
  currency: z.string(),
  ethPriceUsd: z.number(),
  usdDonateValue: z.number(),
  totalContribution: z.number().nullable(),
  fundingRoundId: z.string().nullable(),
});

export const donationsResponseSchema = z.object({
  donations: z.array(donationSchema),
  total: z.number(),
  username: z.string().nullable(),
});

export type DonationDto = z.infer<typeof donationSchema>;
export type DonationsResponseDto = z.infer<typeof donationsResponseSchema>;
