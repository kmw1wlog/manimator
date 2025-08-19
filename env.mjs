import { z } from 'zod'

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  REDIS_URL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
