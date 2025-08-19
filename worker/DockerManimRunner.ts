import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { uploadBuffer } from '../lib/storage';

export interface RenderOptions {
  code: string;
  sceneName: string;
  quality?: string; // e.g. 'ql', 'qh'
  onStatus?: (status: string) => void;
  onLog?: (log: string) => void;
}

export default class DockerManimRunner {
  static async render({
    code,
    sceneName,
    quality = 'ql',
    onStatus,
    onLog,
  }: RenderOptions) {
    const id = randomUUID();
    const workDir = path.join('/tmp', `manim-${id}`);
    await fs.mkdir(workDir, { recursive: true });

    const scriptPath = path.join(workDir, 'scene.py');
    await fs.writeFile(scriptPath, code, 'utf-8');

    const outputFile = 'output.mp4';
    const image = process.env.MANIM_IMAGE || 'manimcommunity/manim:latest';

    onStatus?.('running');
    const args = [
      'run',
      '--rm',
      '-v',
      `${workDir}:/manim`,
      image,
      'manim',
      `-p${quality}`,
      'scene.py',
      sceneName,
      '--format=mp4',
      '-o',
      outputFile,
    ];

    const proc = spawn('docker', args, { cwd: workDir });
    proc.stdout.on('data', (d) => onLog?.(d.toString()));
    proc.stderr.on('data', (d) => onLog?.(d.toString()));

    await new Promise<void>((resolve, reject) => {
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`docker exited with code ${code}`));
      });
      proc.on('error', reject);
    });
    onStatus?.('uploading');
    const videoPath = path.join(workDir, outputFile);
    const buffer = await fs.readFile(videoPath);
    const key = `renders/${id}.mp4`;
    await uploadBuffer(key, buffer, 'video/mp4');

    await fs.rm(workDir, { recursive: true, force: true });

    return { key };
  }
}
