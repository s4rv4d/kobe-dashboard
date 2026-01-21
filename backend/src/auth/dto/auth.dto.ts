import { z } from 'zod';

export const verifyRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().min(1),
  message: z.string().min(1),
});

export type VerifyRequestDto = z.infer<typeof verifyRequestSchema>;

export interface VerifyResponseDto {
  address: string;
  expiresAt: number;
}
