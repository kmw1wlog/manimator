import { create } from 'zustand';

export interface Artifact {
  original: string;
  modified: string;
}

interface PromptFields {
  system: string;
  user: string;
  data: string;
}

interface NodeRun {
  id: string;
  label: string;
  artifact: Artifact;
}

interface InspectorState {
  artifact: Artifact;
  prompt: PromptFields;
  history: NodeRun[];
  setArtifact: (artifact: Artifact) => void;
  setPrompt: (prompt: PromptFields) => void;
  addHistory: (run: NodeRun) => void;
}

export const useInspectorStore = create<InspectorState>((set) => ({
  artifact: { original: '', modified: '' },
  prompt: { system: '', user: '', data: '' },
  history: [],
  setArtifact: (artifact: Artifact) => set({ artifact }),
  setPrompt: (prompt: PromptFields) => set({ prompt }),
  addHistory: (run: NodeRun) =>
    set((state) => ({ history: [...state.history, run] })),
}));
