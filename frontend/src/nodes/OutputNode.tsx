import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { useRenderStore } from '../../renderStore';

const OutputNode: React.FC<NodeProps> = (props) => {
  const { status, videoUrl, start } = useRenderStore();

  const handleClick = () => {
    const code = props.data?.code || '';
    start({ code });
  };

  return (
    <BaseNode {...props} status={status}>
      {videoUrl ? (
        <video
          src={videoUrl}
          width={120}
          controls
          style={{ display: 'block', marginTop: 8 }}
        />
      ) : (
        <div style={{ marginTop: 8 }}>
          <button onClick={handleClick}>▶</button>
        </div>
      )}
    </BaseNode>
  );
};

export default OutputNode;

