import { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useInspectorStore } from './store';
import { useRenderStore } from './renderStore';

export default function Inspector() {
  const { artifact, setArtifact, prompt, setPrompt, history, addHistory } =
    useInspectorStore();
  const { videoUrl, logs } = useRenderStore();
  const [activeTab, setActiveTab] = useState<'result' | 'prompt' | 'history' | 'logs'>('result');
  const [showDiff, setShowDiff] = useState(false);
  const [draft, setDraft] = useState(artifact.modified);

  const saveDraft = () => {
    const next = { original: artifact.original, modified: draft };
    setArtifact(next);
    addHistory({ id: Date.now().toString(), label: 'version ' + history.length, artifact: next });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {videoUrl && (
        <div style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
          <video src={videoUrl} controls style={{ width: '100%' }} />
          <a href={videoUrl} download>
            Download
          </a>
        </div>
      )}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setActiveTab('result')}>Result</button>
        <button onClick={() => setActiveTab('prompt')}>Prompt</button>
        <button onClick={() => setActiveTab('history')}>History</button>
        <button onClick={() => setActiveTab('logs')}>Logs</button>
      </div>
      <div style={{ flex: 1 }}>
        {activeTab === 'result' && (
          <div style={{ height: '100%' }}>
            <div style={{ marginBottom: '8px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={showDiff}
                  onChange={(e) => setShowDiff(e.target.checked)}
                />
                Original ↔ Modified Diff
              </label>
              <button onClick={saveDraft}>Save/Apply</button>
            </div>
            {showDiff ? (
              <DiffEditor
                original={artifact.original}
                modified={draft}
                onChange={(v) => setDraft(v || '')}
                height="80vh"
                language="python"
              />
            ) : (
              <Editor
                value={draft}
                onChange={(v) => setDraft(v || '')}
                height="80vh"
                language="python"
              />
            )}
          </div>
        )}
        {activeTab === 'prompt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
            <input
              placeholder="System"
              value={prompt.system}
              onChange={(e) => setPrompt({ ...prompt, system: e.target.value })}
            />
            <input
              placeholder="User"
              value={prompt.user}
              onChange={(e) => setPrompt({ ...prompt, user: e.target.value })}
            />
            <input
              placeholder="Data"
              value={prompt.data}
              onChange={(e) => setPrompt({ ...prompt, data: e.target.value })}
            />
          </div>
        )}
        {activeTab === 'history' && (
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Version</th>
                <th style={{ textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((run) => (
                <tr key={run.id}>
                  <td>{run.label}</td>
                  <td>
                    <button onClick={() => setArtifact(run.artifact)}>Rollback</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'logs' && (
          <div style={{ padding: '8px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {logs.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
