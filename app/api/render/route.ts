import fs from 'fs/promises';
import path from 'path';
import DockerManimRunner from '../../../worker/DockerManimRunner';
import { getPresignedUrl } from '../../../lib/storage';

export async function POST(req: Request) {
  try {
    const { code, sceneName = 'MainScene', quality = 'ql', artifactId } = await req.json();

    let source = code as string | undefined;
    if (!source && artifactId) {
      const filePath = path.join(process.cwd(), 'artifacts', `${artifactId}.py`);
      source = await fs.readFile(filePath, 'utf-8');
    }

    if (!source) {
      return new Response(
        JSON.stringify({ error: 'No code provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { key } = await DockerManimRunner.render({ code: source, sceneName, quality });
    const url = await getPresignedUrl(key, 'video/mp4', 3600);

    return new Response(
      JSON.stringify({ videoKey: key, videoUrl: url }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('render error', error);
    return new Response(
      JSON.stringify({ error: 'Failed to render video' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
