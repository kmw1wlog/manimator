import { Handle, Position, NodeProps } from '@xyflow/react'

export default function OutputNode({}: NodeProps) {
  return (
    <div className="rounded bg-white p-2 shadow text-sm">
      Output
      <Handle type="target" position={Position.Top} />
    </div>
  )
}
