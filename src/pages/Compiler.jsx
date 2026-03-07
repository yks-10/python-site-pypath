import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab, historyKeymap, history } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { usePyodide } from '../hooks/usePyodide';

const STARTER_CODE = `# Write your Python code here
print("Hello, PyPath!")

# Try something fun:
for i in range(1, 6):
    print(f"  {'*' * i}")
`;

const compilerTheme = EditorView.theme({
  '&': {
    fontSize: '0.875rem',
    height: '100%',
    background: '#0d1117',
  },
  '.cm-scroller': {
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
    lineHeight: '1.7',
    overflow: 'auto',
  },
  '.cm-content': { padding: '16px 0' },
  '.cm-line': { padding: '0 16px' },
  '.cm-gutters': {
    background: '#0d1117',
    borderRight: '1px solid #1e2435',
    color: '#3a4155',
    paddingRight: '8px',
  },
  '.cm-activeLineGutter': { background: 'rgba(59,130,246,0.06)' },
  '.cm-activeLine': { background: 'rgba(59,130,246,0.04)' },
  '.cm-cursor': { borderLeftColor: '#3b82f6' },
  '.cm-selectionBackground': { background: 'rgba(59,130,246,0.2) !important' },
  '&.cm-focused .cm-selectionBackground': { background: 'rgba(59,130,246,0.25) !important' },
});

export default function Compiler() {
  const editorContainerRef = useRef(null);
  const editorViewRef = useRef(null);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const { status, initialize, runCode } = usePyodide();

  useEffect(() => {
    if (!editorContainerRef.current || editorViewRef.current) return;

    const startState = EditorState.create({
      doc: STARTER_CODE,
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLine(),
        python(),
        oneDark,
        compilerTheme,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.lineWrapping,
      ],
    });

    editorViewRef.current = new EditorView({
      state: startState,
      parent: editorContainerRef.current,
    });

    return () => {
      editorViewRef.current?.destroy();
      editorViewRef.current = null;
    };
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleRun = useCallback(async () => {
    if (!editorViewRef.current || isRunning) return;
    const code = editorViewRef.current.state.doc.toString();
    setIsRunning(true);
    setOutput(null);
    try {
      const result = await runCode(code);
      setOutput(result);
    } catch (err) {
      setOutput({ stdout: '', stderr: '', error: err.message });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, runCode]);

  const handleClear = useCallback(() => {
    if (!editorViewRef.current) return;
    editorViewRef.current.dispatch({
      changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: '' },
    });
  }, []);

  const handleClearOutput = useCallback(() => setOutput(null), []);

  const hasError = output && (output.error || output.stderr);
  const hasOutput = output && output.stdout;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 flex flex-col"
      style={{ background: '#0f1117' }}
    >
      {/* Header */}
      <div
        className="border-b border-[#2a3040] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4"
        style={{ background: '#161b27' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 2px 8px rgba(168,85,247,0.3)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div>
            <h1 className="font-mono font-bold text-[#e8eaf0] text-sm sm:text-base">Python Compiler</h1>
            <p className="font-mono text-xs text-[#6b7280]">Powered by Pyodide — runs in your browser</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pyodide status */}
          <div
            className="hidden sm:flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-lg"
            style={{
              background: status === 'ready'
                ? 'rgba(34,197,94,0.1)'
                : status === 'loading'
                ? 'rgba(250,204,21,0.1)'
                : status === 'error'
                ? 'rgba(239,68,68,0.1)'
                : 'rgba(107,114,128,0.1)',
              color: status === 'ready'
                ? '#22c55e'
                : status === 'loading'
                ? '#facc15'
                : status === 'error'
                ? '#ef4444'
                : '#6b7280',
              border: `1px solid ${
                status === 'ready'
                  ? 'rgba(34,197,94,0.3)'
                  : status === 'loading'
                  ? 'rgba(250,204,21,0.3)'
                  : status === 'error'
                  ? 'rgba(239,68,68,0.3)'
                  : 'rgba(107,114,128,0.3)'
              }`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: status === 'ready' ? '#22c55e' : status === 'loading' ? '#facc15' : status === 'error' ? '#ef4444' : '#6b7280',
                animation: status === 'loading' ? 'pulse 1s infinite' : 'none',
              }}
            />
            {status === 'ready' ? 'Ready' : status === 'loading' ? 'Loading...' : status === 'error' ? 'Error' : 'Idle'}
          </div>

          <button
            onClick={handleClear}
            className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{ background: '#1e2435', color: '#9ca3af', border: '1px solid #2a3040' }}
          >
            Clear
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning || status === 'error'}
            className="flex items-center gap-1.5 font-mono text-sm px-4 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isRunning ? 'rgba(168,85,247,0.2)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
              color: '#fff',
              boxShadow: isRunning ? 'none' : '0 2px 8px rgba(168,85,247,0.3)',
            }}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor + Output split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: 0 }}>
        {/* Editor pane */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#2a3040]" style={{ minHeight: '300px' }}>
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-[#2a3040]"
            style={{ background: '#161b27' }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[#facc15] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e] opacity-70" />
              </div>
              <span className="font-mono text-xs text-[#6b7280] ml-1">main.py</span>
            </div>
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}
            >
              python
            </span>
          </div>
          <div
            ref={editorContainerRef}
            className="flex-1 overflow-hidden"
            style={{ background: '#0d1117' }}
          />
        </div>

        {/* Output pane */}
        <div className="flex flex-col lg:w-[45%]" style={{ minHeight: '200px' }}>
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-[#2a3040]"
            style={{ background: '#161b27' }}
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span className="font-mono text-xs text-[#9ca3af]">Output</span>
            </div>
            {output && (
              <button
                onClick={handleClearOutput}
                className="font-mono text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors"
              >
                clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 font-mono text-sm" style={{ background: '#0a0e15' }}>
            {!output && !isRunning && (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-[#3a4155]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <p className="text-xs">Press Run to execute your code</p>
                <p className="text-xs opacity-60">Ctrl+Enter to run quickly</p>
              </div>
            )}

            {isRunning && (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2 text-[#a855f7]">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  <span className="text-xs">Executing...</span>
                </div>
              </div>
            )}

            {output && !isRunning && (
              <div className="space-y-3">
                {hasOutput && (
                  <div>
                    <span className="text-xs text-[#6b7280] block mb-1">stdout</span>
                    <pre
                      className="text-[#22c55e] text-sm leading-relaxed whitespace-pre-wrap break-words"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {output.stdout}
                    </pre>
                  </div>
                )}
                {output.stderr && (
                  <div>
                    <span className="text-xs text-[#6b7280] block mb-1">stderr</span>
                    <pre
                      className="text-[#facc15] text-sm leading-relaxed whitespace-pre-wrap break-words"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {output.stderr}
                    </pre>
                  </div>
                )}
                {output.error && (
                  <div>
                    <span className="text-xs text-[#6b7280] block mb-1">error</span>
                    <pre
                      className="text-[#ef4444] text-sm leading-relaxed whitespace-pre-wrap break-words"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {output.error}
                    </pre>
                  </div>
                )}
                {!hasOutput && !hasError && (
                  <div className="flex items-center gap-2 text-[#22c55e]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-xs">Executed successfully (no output)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
