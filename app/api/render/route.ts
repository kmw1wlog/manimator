import fs from 'fs/promises';
import path from 'path';
import DockerManimRunner from '../../../worker/DockerManimRunner';
import { getPresignedUrl } from '../../../lib/storage';

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: string) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${data}\n\n`)
        );
      };

      try {
        const {
          code,
          sceneName = 'MainScene',
          quality = 'ql',
          artifactId,
        } = await req.json();

        let source = code as string | undefined;
        if (!source && artifactId) {
          const filePath = path.join(process.cwd(), 'artifacts', `${artifactId}.py`);
          source = await fs.readFile(filePath, 'utf-8');
        }

        if (!source) {
          send('error', 'No code provided');
          controller.close();
          return;
        }

        send('status', 'queued');

        const { key } = await DockerManimRunner.render({
          code: source,
          sceneName,
          quality,
          onStatus: (s) => send('status', s),
          onLog: (l) => send('log', l),
        });

        const url = await getPresignedUrl(key, 'video/mp4', 3600);
        send('status', 'done');
        send('result', JSON.stringify({ videoKey: key, videoUrl: url }));
      } catch (error) {
        console.error('render error', error);
        send('error', 'Failed to render video');
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    },
  });
}

