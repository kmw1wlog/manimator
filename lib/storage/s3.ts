import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../../env.mjs';
import type { StorageAdapter } from './types';

const client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

async function uploadBuffer(key: string, buffer: Buffer, mime: string) {
  const cmd = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mime,
  });
  await client.send(cmd);
}

async function getPresignedUrl(key: string, mime: string, expires: number) {
  const cmd = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: mime,
  });
  return getSignedUrl(client, cmd, { expiresIn: expires });
}

const adapter: StorageAdapter = { uploadBuffer, getPresignedUrl };
export default adapter;
