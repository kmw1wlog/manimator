import { z } from 'zod';

const baseSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  STORAGE_PROVIDER: z.enum(['s3', 'r2', 'supabase']).default('s3')
});

const s3Schema = z.object({
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1)
});

const r2Schema = z.object({
  R2_ENDPOINT: z.string().url(),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_ACCESS_KEY: z.string().min(1),
  R2_SECRET_KEY: z.string().min(1)
});

const supabaseSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON: z.string().min(1),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_BUCKET: z.string().min(1)
});

function getEnv() {
  const base = baseSchema.parse(process.env);
  switch (base.STORAGE_PROVIDER) {
    case 'r2':
      return { ...base, ...r2Schema.parse(process.env) };
    case 'supabase':
      return { ...base, ...supabaseSchema.parse(process.env) };
    default:
      return { ...base, ...s3Schema.parse(process.env) };
  }
}

const env = getEnv();
export default env;
