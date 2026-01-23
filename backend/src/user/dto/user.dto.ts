import { z } from 'zod';

export const solanaWalletSchema = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet address')
  .nullable()
  .optional();

export const emailSchema = z.string().email('Invalid email format').nullable().optional();

export const updateUserProfileSchema = z.object({
  email: emailSchema,
  solanaWallet: solanaWalletSchema,
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;

export const twitterCallbackSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  state: z.string().min(1, 'State is required'),
});

export type TwitterCallbackDto = z.infer<typeof twitterCallbackSchema>;
