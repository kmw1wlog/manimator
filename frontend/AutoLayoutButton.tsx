import { autoLayout } from '../lib/layout';
import { useGraphStore } from '../lib/store';

export default function AutoLayoutButton() {
  const graph = useGraphStore((s) => s.graph);
  const setGraph = useGraphStore((s) => s.setGraph);

  const handleLayout = async () => {
    const laidOut = await autoLayout(graph);
    setGraph(laidOut);
  };

  return <button onClick={handleLayout}>Auto Layout</button>;
}
