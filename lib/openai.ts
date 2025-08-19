// @ts-ignore - env.mjs has no TypeScript declarations
import env from '../env.mjs';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
}

class OpenAIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async chatCompletion(body: ChatCompletionRequest) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }
    return res.json();
  }

  chat = {
    completions: {
      create: (body: ChatCompletionRequest) => this.chatCompletion(body),
    },
  };
}

const openai = new OpenAIClient(env.OPENAI_API_KEY);

export default openai;
