import { Handle, Position, NodeProps } from '@xyflow/react'

export default function StoryboardNode({}: NodeProps) {
  return (
    <div className="rounded bg-white p-2 shadow text-sm">
      Storyboard
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
