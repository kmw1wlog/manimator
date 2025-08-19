import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import openai from './openai';
import { Storyboard, StoryboardSchema } from './types';
import { uploadBuffer } from './storage';
import { randomUUID } from 'crypto';

export interface StoryboardOptions {
  tone?: string;
  length?: string;
  sceneCount?: number;
}

export interface GenerateStoryboardInput {
  ocrJson: unknown;
  options?: StoryboardOptions;
  system?: string;
  user?: string;
  data?: string;
}

/**
 * Generate a storyboard from OCR JSON and options.
 * Combines system, user and data prompts for the LLM call and
 * stores the resulting storyboard as an artifact.
 */
export async function generateStoryboard({
  ocrJson,
  options = {},
  system = '',
  user = '',
  data = '',
}: GenerateStoryboardInput): Promise<{ artifactId: string; json: Storyboard }> {
  const messages: ChatCompletionMessageParam[] = [];
  if (system) {
    messages.push({ role: 'system', content: system });
  }
  const userContent = [user, data, JSON.stringify({ ocr: ocrJson, options })]
    .filter(Boolean)
    .join('\n');
  messages.push({ role: 'user', content: userContent });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
  });
  const content = completion.choices[0]?.message?.content ?? '{}';
  const json = StoryboardSchema.parse(JSON.parse(content));

  const artifactId = `storyboards/${randomUUID()}.json`;
  await uploadBuffer(
    artifactId,
    Buffer.from(JSON.stringify(json), 'utf-8'),
    'application/json'
  );

  return { artifactId, json };
}
