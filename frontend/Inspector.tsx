import { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useInspectorStore } from './store';

export default function Inspector() {
  const { artifact, setArtifact, prompt, setPrompt, history } = useInspectorStore();
  const [activeTab, setActiveTab] = useState<'result' | 'prompt' | 'history'>('result');
  const [showDiff, setShowDiff] = useState(false);
  const [draft, setDraft] = useState(artifact.modified);

  const saveDraft = () => {
    setArtifact({ original: artifact.original, modified: draft });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setActiveTab('result')}>Result</button>
        <button onClick={() => setActiveTab('prompt')}>Prompt</button>
        <button onClick={() => setActiveTab('history')}>History</button>
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
          <ul>
            {history.map((run) => (
              <li key={run.id}>
                {run.label}
                {/* Placeholder for artifact comparison button */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
