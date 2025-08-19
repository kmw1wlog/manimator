import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import openai from '../../../lib/openai';

export async function POST(req: Request) {
  try {
    const { storyboardJson, styleOptions } = await req.json();

    const messages = [
      {
        role: 'system',
        content:
          'You convert storyboard JSON into Python code using Manim Community Edition. Place scenes sequentially inside a construct() method and annotate each scene with comments marking start and end with timecodes.',
      },
      {
        role: 'user',
        content: `Storyboard JSON:\n${JSON.stringify(
          storyboardJson
        )}\n\nStyle Options:\n${JSON.stringify(styleOptions)}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const code = completion.choices[0].message?.content || '';

    const artifactId = randomUUID();
    const artifactsDir = path.join(process.cwd(), 'artifacts');
    await fs.mkdir(artifactsDir, { recursive: true });
    const filePath = path.join(artifactsDir, `${artifactId}.py`);
    await fs.writeFile(filePath, code, 'utf-8');

    return new Response(
      JSON.stringify({ artifactId, code }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('storyboard-to-manim error', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
