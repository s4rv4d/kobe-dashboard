import { z } from 'zod'

export const solanaWalletSchema = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet address')
  .nullable()
  .optional()

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .nullable()
  .optional()

export const userProfileFormSchema = z.object({
  email: z.union([z.string().email('Invalid email format'), z.literal('')]).optional(),
  solanaWallet: z.union([
    z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet'),
    z.literal('')
  ]).optional(),
})

export type UserProfileFormValues = z.infer<typeof userProfileFormSchema>

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateProfilePhoto(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit'
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images allowed'
  }
  return null
}
