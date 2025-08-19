import { Handle, Position, NodeProps } from '@xyflow/react'

export default function InputOCRNode({}: NodeProps) {
  return (
    <div className="rounded bg-white p-2 shadow text-sm">
      OCR
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
