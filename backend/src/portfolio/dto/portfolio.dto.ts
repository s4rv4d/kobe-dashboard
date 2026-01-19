import { z } from 'zod'

export const addressParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
})

export const tokenQuerySchema = z.object({
  sort: z.enum(['value', 'name', 'balance']).default('value'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const nftQuerySchema = z.object({
  collection: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
})

export type AddressParam = z.infer<typeof addressParamSchema>
export type TokenQuery = z.infer<typeof tokenQuerySchema>
export type NftQuery = z.infer<typeof nftQuerySchema>
