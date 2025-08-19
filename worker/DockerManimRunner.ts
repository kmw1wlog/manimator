import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';
import { exec as execCallback } from 'child_process';
import { uploadBuffer } from '../lib/storage';

const exec = util.promisify(execCallback);

export interface RenderOptions {
  code: string;
  sceneName: string;
  quality?: string; // e.g. 'ql', 'qh'
}

export default class DockerManimRunner {
  static async render({ code, sceneName, quality = 'ql' }: RenderOptions) {
    const id = randomUUID();
    const workDir = path.join('/tmp', `manim-${id}`);
    await fs.mkdir(workDir, { recursive: true });

    const scriptPath = path.join(workDir, 'scene.py');
    await fs.writeFile(scriptPath, code, 'utf-8');

    const outputFile = 'output.mp4';
    const image = process.env.MANIM_IMAGE || 'manimcommunity/manim:latest';

    const cmd = [
      'docker run --rm',
      `-v ${workDir}:/manim`,
      image,
      'manim',
      `-p${quality}`,
      'scene.py',
      sceneName,
      '--format=mp4',
      '-o',
      outputFile,
    ].join(' ');

    await exec(cmd, { cwd: workDir });

    const videoPath = path.join(workDir, outputFile);
    const buffer = await fs.readFile(videoPath);
    const key = `renders/${id}.mp4`;
    await uploadBuffer(key, buffer, 'video/mp4');

    await fs.rm(workDir, { recursive: true, force: true });

    return { key };
  }
}
