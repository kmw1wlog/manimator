'use client'

import React, { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  useEdgesState,
  useNodesState,
  Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import InputOCRNode from '@/components/nodes/InputOCRNode'
import StoryboardNode from '@/components/nodes/StoryboardNode'
import ManimCodeNode from '@/components/nodes/ManimCodeNode'
import OutputNode from '@/components/nodes/OutputNode'
import Inspector from '@/components/inspector/Inspector'
import { useStudioStore } from '@/lib/store'

const nodeTypes = {
  inputOCR: InputOCRNode,
  storyboard: StoryboardNode,
  manimCode: ManimCodeNode,
  output: OutputNode,
}

const initialNodes: Node[] = [
  { id: 'input', type: 'inputOCR', position: { x: -200, y: 0 }, data: {} },
  { id: 'storyboard', type: 'storyboard', position: { x: 0, y: 0 }, data: {} },
  { id: 'code', type: 'manimCode', position: { x: 200, y: 0 }, data: {} },
  { id: 'output', type: 'output', position: { x: 0, y: 200 }, data: {} },
]

const initialEdges: Edge[] = [
  { id: 'e1', source: 'input', target: 'output' },
  { id: 'e2', source: 'storyboard', target: 'output' },
  { id: 'e3', source: 'code', target: 'output' },
]

export default function StudioPage() {
  const { setSelectedNode } = useStudioStore()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
    },
    [setSelectedNode]
  )

  return (
    <div className="flex h-full">
      <div className="flex-[2]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      <div className="flex-[1] border-l">
        <Inspector />
      </div>
    </div>
  )
}
