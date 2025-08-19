import ELK from 'elkjs/lib/elk.bundled.js';
import { Graph } from './types';

const elk = new ELK();

export async function autoLayout(graph: Graph): Promise<Graph> {
  const elkGraph = {
    id: 'root',
    layoutOptions: { 'elk.algorithm': 'layered' },
    children: graph.nodes.map((n) => ({ id: n.id, width: 180, height: 100 })),
    edges: graph.edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  } as any;

  const layout = await elk.layout(elkGraph);
  const positions: Record<string, { x: number; y: number }> = {};
  layout.children?.forEach((c: any) => {
    positions[c.id] = { x: c.x || 0, y: c.y || 0 };
  });

  const nodes = graph.nodes.map((n) => ({
    ...n,
    data: { ...n.data, position: positions[n.id] },
  }));
  return { ...graph, nodes };
}
