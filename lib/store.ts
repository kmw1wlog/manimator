import { create } from 'zustand';
import { Artifact, Graph, NodeRun, RunStatus } from './types';

type GraphStore = {
  graph: Graph;
  selectedNode?: string;
  artifacts: Record<string, Artifact>;
  runs: Record<string, NodeRun>;
  setGraph: (graph: Graph) => void;
  selectNode: (nodeId?: string) => void;
  setArtifact: (nodeId: string, artifact: Artifact) => void;
  setRunStatus: (nodeId: string, status: RunStatus) => void;
};

export const useGraphStore = create<GraphStore>((set) => ({
  graph: { nodes: [], edges: [] },
  selectedNode: undefined,
  artifacts: {},
  runs: {},
  setGraph: (graph) => set({ graph }),
  selectNode: (nodeId) => set({ selectedNode: nodeId }),
  setArtifact: (nodeId, artifact) =>
    set((state) => ({
      artifacts: { ...state.artifacts, [nodeId]: artifact },
    })),
  setRunStatus: (nodeId, status) =>
    set((state) => ({
      runs: {
        ...state.runs,
        [nodeId]: { ...(state.runs[nodeId] ?? { status }), status },
      },
    })),
}));

// temporary dummy artifact for panel visibility
useGraphStore.getState().setArtifact('demo-node', {
  type: 'ocr',
  content: 'Dummy artifact for preview',
});
