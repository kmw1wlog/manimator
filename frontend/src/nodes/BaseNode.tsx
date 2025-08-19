import React from 'react';
import { Handle, Position, NodeToolbar, NodeProps } from 'reactflow';
import useRightPanel from '../hooks/useRightPanel';

export type NodeStatus = 'idle' | 'generating' | 'error' | 'done';

const statusColor: Record<NodeStatus, string> = {
  idle: 'gray',
  generating: 'blue',
  error: 'red',
  done: 'green',
};

interface BaseNodeProps extends NodeProps {
  status?: NodeStatus;
  children?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ status = 'idle', data, children }) => {
  const { switchTab } = useRightPanel();

  const handleToolbarClick = (tab: string) => () => switchTab(tab);

  return (
    <div style={{ position: 'relative', padding: 10 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: statusColor[status],
          position: 'absolute',
          top: 2,
          left: 2,
        }}
      />
      {data?.label && <div style={{ marginLeft: 16 }}>{data.label}</div>}
      {children}

      <NodeToolbar isVisible position={Position.Top} style={{ display: 'flex', gap: 4 }}>
        <button onClick={handleToolbarClick('regenerate')}>재생성</button>
        <button onClick={handleToolbarClick('edit')}>편집 열기</button>
        <button onClick={handleToolbarClick('history')}>히스토리</button>
      </NodeToolbar>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default BaseNode;
