import env from '../../env.mjs';
import type { StorageAdapter } from './types';
import s3 from './s3';
import r2 from './r2';
import supabase from './supabase';

const adapters: Record<string, StorageAdapter> = {
  s3,
  r2,
  supabase,
};

const storage = adapters[env.STORAGE_PROVIDER] ?? s3;

export const uploadBuffer = storage.uploadBuffer;
export const getPresignedUrl = storage.getPresignedUrl;
