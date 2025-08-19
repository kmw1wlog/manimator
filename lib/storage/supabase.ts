import { createClient } from '@supabase/supabase-js';
import env from '../../env.mjs';
import type { StorageAdapter } from './types';

const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);

async function uploadBuffer(key: string, buffer: Buffer, mime: string) {
  const { error } = await client.storage
    .from(env.SUPABASE_BUCKET)
    .upload(key, buffer, { contentType: mime, upsert: true });
  if (error) throw error;
}

async function getPresignedUrl(key: string, _mime: string, expires: number) {
  const { data, error } = await client.storage
    .from(env.SUPABASE_BUCKET)
    .createSignedUrl(key, expires);
  if (error) throw error;
  return data.signedUrl;
}

const adapter: StorageAdapter = { uploadBuffer, getPresignedUrl };
export default adapter;
