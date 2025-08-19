import { create } from 'zustand';
import type { NodeStatus } from './src/nodes/BaseNode';

interface StartPayload {
  code: string;
  sceneName?: string;
  quality?: string;
  artifactId?: string;
}

interface RenderState {
  status: NodeStatus;
  logs: string[];
  videoUrl: string | null;
  start: (payload: StartPayload) => Promise<void>;
}

export const useRenderStore = create<RenderState>((set) => ({
  status: 'idle',
  logs: [],
  videoUrl: null,
  start: async ({ code, sceneName = 'MainScene', quality = 'ql', artifactId }) => {
    set({ status: 'idle', logs: [], videoUrl: null });
    const res = await fetch('/api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, sceneName, quality, artifactId }),
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const [eventLine, dataLine] = raw.split('\n');
        const event = eventLine.replace('event: ', '').trim();
        const data = dataLine?.replace('data: ', '').trim();
        if (event === 'status') {
          set({ status: data as NodeStatus });
        } else if (event === 'log') {
          set((s) => ({ logs: [...s.logs, data] }));
        } else if (event === 'result') {
          try {
            const { videoUrl } = JSON.parse(data);
            set({ videoUrl });
          } catch {
            /* ignore */
          }
        } else if (event === 'error') {
          set((s) => ({ status: 'error', logs: [...s.logs, data] }));
        }
      }
    }
  },
}));

