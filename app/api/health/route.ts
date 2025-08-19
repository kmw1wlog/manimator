import env from '../../../env.mjs';

export async function GET() {
  return new Response(
    JSON.stringify({ storage: env.STORAGE_PROVIDER }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
