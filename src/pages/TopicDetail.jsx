import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { getTopicById, getAdjacentTopics, LEVELS } from '../data/curriculum';
import Sidebar from '../components/Layout/Sidebar';
import LevelBadge from '../components/UI/LevelBadge';
import CodeBlock from '../components/UI/CodeBlock';
import { usePyodide } from '../hooks/usePyodide';

// Parse markdown-ish content into structured blocks
function parseContent(content) {
  if (!content) return [];
  const blocks = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'python';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) });
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) });
      i++;
      continue;
    }

    // Bullet lists
    if (line.trimStart().startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].trimStart().slice(2));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Paragraph
    if (line.trim()) {
      const paraLines = [];
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].trim().startsWith('```') && !lines[i].trimStart().startsWith('- ')) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length) {
        blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
      }
      continue;
    }

    i++;
  }
  return blocks;
}

function renderInline(text) {
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e8eaf0;font-weight:600">$1</strong>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code style="font-family:JetBrains Mono,monospace;font-size:0.875em;background:rgba(59,130,246,0.1);color:#a5d6ff;padding:2px 6px;border-radius:4px;border:1px solid rgba(59,130,246,0.2)">$1</code>');
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em style="color:#9ca3af;font-style:italic">$1</em>');
  return text;
}

function ContentBlock({ block, index }) {
  switch (block.type) {
    case 'h2':
      return (
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="font-mono font-bold text-xl text-[#e8eaf0] mt-8 mb-4 pb-2 border-b border-[#2a3040]"
        >
          {block.text}
        </motion.h2>
      );
    case 'h3':
      return (
        <h3 className="font-mono font-semibold text-base text-[#9ca3af] mt-5 mb-2">
          {block.text}
        </h3>
      );
    case 'paragraph':
      return (
        <p
          className="font-serif text-[1rem] text-[#c5cad5] leading-[1.85] mb-4"
          dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
        />
      );
    case 'list':
      return (
        <ul className="space-y-2 mb-4 pl-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#3b82f6]" />
              <span
                className="font-serif text-sm text-[#c5cad5] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderInline(item) }}
              />
            </li>
          ))}
        </ul>
      );
    case 'code':
      return <CodeBlock code={block.code} language={block.lang} />;
    default:
      return null;
  }
}

// Real Python playground powered by Pyodide (CPython → WebAssembly)
function CodePlayground({ defaultCode = '# Try it here!\nprint("Hello, PyPath!")' }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const outputEndRef = useRef(null);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [execTime, setExecTime] = useState(null);
  const { status, loadError, initialize, runCode: pyRun } = usePyodide();

  // Boot CodeMirror editor
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: defaultCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        python(),
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.theme({
          '&': { background: '#0d1117' },
          '.cm-content': {
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            padding: '12px 0',
          },
          '.cm-line': { paddingLeft: '12px', paddingRight: '12px' },
          '.cm-gutters': {
            background: '#0d1117',
            borderRight: '1px solid #1e2435',
            paddingRight: '8px',
            color: '#3a4155',
          },
          '.cm-activeLineGutter': { background: 'rgba(59,130,246,0.06)' },
          '.cm-activeLine': { background: 'rgba(59,130,246,0.06)' },
          '.cm-selectionBackground': { background: 'rgba(59,130,246,0.25) !important' },
          '.cm-focused .cm-selectionBackground': { background: 'rgba(59,130,246,0.25)' },
          '.cm-cursor': { borderLeftColor: '#3b82f6', borderLeftWidth: '2px' },
          '&.cm-focused': { outline: 'none' },
        }),
        EditorView.lineWrapping,
      ],
    });

    viewRef.current = new EditorView({ state, parent: editorRef.current });
    return () => { viewRef.current?.destroy(); viewRef.current = null; };
  }, []);

  // Scroll output to bottom when new content arrives
  useEffect(() => {
    if (output) outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleRun = useCallback(async () => {
    if (!viewRef.current || isRunning) return;
    const code = viewRef.current.state.doc.toString().trim();
    if (!code) return;

    setIsRunning(true);
    setHasRun(true);
    setOutput('');
    setExecTime(null);

    // Lazy-load Pyodide on first run
    if (status !== 'ready') {
      setOutput('⏳ Loading Python runtime (first run only, ~5s)...\n');
    }

    const t0 = performance.now();
    try {
      const result = await pyRun(code);
      const elapsed = ((performance.now() - t0) / 1000).toFixed(3);
      setExecTime(elapsed);

      const parts = [];
      if (result.stdout) parts.push(result.stdout);
      if (result.stderr && !result.error) parts.push(`\x1b[33m${result.stderr}\x1b[0m`);
      if (result.error) {
        // Clean up Pyodide's verbose traceback slightly
        const errLines = result.error.split('\n');
        const cleaned = errLines
          .filter(l => !l.includes('File "<exec>"') || errLines.indexOf(l) > 1)
          .join('\n')
          .trim();
        parts.push(cleaned);
      }

      setOutput({
        text: parts.join('\n') || '(no output)',
        isError: !!result.error,
        elapsed,
      });
    } catch (err) {
      setOutput({ text: err.message, isError: true, elapsed: null });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, status, pyRun]);

  // Keyboard shortcut: Shift+Enter to run
  useEffect(() => {
    const handler = (e) => {
      if ((e.shiftKey && e.key === 'Enter') && editorRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        handleRun();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleRun]);

  const clearOutput = () => { setOutput(''); setHasRun(false); setExecTime(null); };

  const isLoadingRuntime = isRunning && status !== 'ready';
  const outputText = typeof output === 'object' ? output.text : output;
  const outputIsError = typeof output === 'object' ? output.isError : false;

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#2a3040]"
      style={{ background: '#0d1117' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a3040]"
        style={{ background: '#161b27' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444', opacity: 0.7 }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#facc15', opacity: 0.7 }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e', opacity: 0.7 }} />
          </div>
          <span className="font-mono text-xs text-[#6b7280]">playground.py</span>
          {/* Runtime status badge */}
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{
              background: status === 'ready'
                ? 'rgba(34,197,94,0.1)'
                : status === 'loading'
                ? 'rgba(250,204,21,0.1)'
                : status === 'error'
                ? 'rgba(239,68,68,0.1)'
                : 'rgba(59,130,246,0.1)',
              color: status === 'ready' ? '#22c55e' : status === 'loading' ? '#facc15' : status === 'error' ? '#ef4444' : '#60a5fa',
              border: `1px solid ${status === 'ready' ? 'rgba(34,197,94,0.3)' : status === 'loading' ? 'rgba(250,204,21,0.3)' : status === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.2)'}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: status === 'ready' ? '#22c55e' : status === 'loading' ? '#facc15' : status === 'error' ? '#ef4444' : '#3b82f6',
                animation: status === 'loading' ? 'pulse 1s infinite' : 'none',
              }}
            />
            {status === 'ready' ? 'Python 3.12' : status === 'loading' ? 'Loading runtime…' : status === 'error' ? 'Runtime error' : 'Pyodide'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block font-mono text-xs text-[#6b7280]">
            Shift+Enter to run
          </span>
          {hasRun && execTime && (
            <span className="font-mono text-xs text-[#6b7280]">{execTime}s</span>
          )}
          {hasRun && (
            <button
              onClick={clearOutput}
              className="font-mono text-xs px-2 py-1 rounded transition-colors"
              style={{ color: '#6b7280', background: '#1e2435', border: '1px solid #2a3040' }}
              onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              Clear
            </button>
          )}
          <button
            onClick={handleRun}
            disabled={isRunning || status === 'error'}
            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isRunning ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.15)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.35)',
              fontWeight: 600,
            }}
            onMouseEnter={e => { if (!isRunning) e.currentTarget.style.background = 'rgba(34,197,94,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = isRunning ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.15)'; }}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                {isLoadingRuntime ? 'Loading…' : 'Running…'}
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* CodeMirror editor area */}
      <div
        ref={editorRef}
        style={{ minHeight: '180px', maxHeight: '400px', overflowY: 'auto' }}
        onClick={() => viewRef.current?.focus()}
      />

      {/* Output panel */}
      <AnimatePresence>
        {(outputText || isLoadingRuntime) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="border-t border-[#2a3040]"
              style={{ background: '#0a0e16' }}
            >
              {/* Output header */}
              <div
                className="flex items-center gap-2 px-4 py-2 border-b border-[#1e2435]"
                style={{ background: '#111827' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={outputIsError ? '#ef4444' : '#22c55e'} strokeWidth="2">
                  {outputIsError
                    ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                    : <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></>
                  }
                </svg>
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: outputIsError ? '#ef4444' : '#22c55e' }}
                >
                  {outputIsError ? 'Error' : 'Output'}
                </span>
                {execTime && !isRunning && (
                  <span className="font-mono text-xs text-[#6b7280] ml-auto">
                    ran in {execTime}s
                  </span>
                )}
              </div>

              {/* Output content */}
              <pre
                className="px-4 py-3 font-mono text-sm leading-relaxed overflow-x-auto"
                style={{
                  color: outputIsError ? '#f87171' : '#86efac',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {outputText}
                <span ref={outputEndRef} />
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pyodide load error */}
      {status === 'error' && loadError && (
        <div className="px-4 py-3 border-t border-[#2a3040]" style={{ background: 'rgba(239,68,68,0.05)' }}>
          <p className="font-mono text-xs text-[#ef4444]">
            Failed to load Python runtime: {loadError}
          </p>
          <p className="font-mono text-xs text-[#6b7280] mt-1">
            Check your network connection and refresh the page.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TopicDetail({ progress = {}, onMarkComplete, onMarkIncomplete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const topRef = useRef(null);

  const topic = getTopicById(id);
  const { prev, next } = getAdjacentTopics(id);
  const isComplete = !!progress[id]?.completed;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.closest('.cm-editor')) return;
      if (e.key === 'ArrowRight' && next) navigate(`/topic/${next.id}`);
      if (e.key === 'ArrowLeft' && prev) navigate(`/topic/${prev.id}`);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, navigate]);

  if (!topic) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center" style={{ background: '#0f1117' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-mono font-bold text-xl text-[#e8eaf0] mb-2">Topic not found</h2>
          <p className="font-mono text-sm text-[#9ca3af] mb-6">The topic "{id}" doesn't exist in the curriculum.</p>
          <Link
            to="/curriculum"
            className="font-mono text-sm px-4 py-2 rounded-lg"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            Browse Curriculum
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = LEVELS[topic.levelId];
  const blocks = parseContent(topic.content);

  return (
    <div className="flex min-h-screen pt-14" style={{ background: '#0f1117' }} ref={topRef}>
      {/* Sidebar */}
      <Sidebar
        progress={progress}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile sidebar toggle */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[#2a3040] sticky top-14 z-20"
          style={{ background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(8px)' }}
        >
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-lg text-[#9ca3af] hover:text-[#e8eaf0] transition-colors"
            style={{ background: '#1a1f2e', border: '1px solid #2a3040' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Curriculum
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#6b7280] overflow-hidden">
            <span className="truncate">{topic.levelLabel}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="truncate">{topic.sectionTitle}</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* Breadcrumb (desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-[#6b7280] mb-6">
            <Link to="/curriculum" className="hover:text-[#9ca3af] transition-colors">Curriculum</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span style={{ color: levelInfo?.color }}>{topic.levelLabel}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-[#9ca3af]">{topic.sectionTitle}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-[#e8eaf0] truncate max-w-xs">{topic.title}</span>
          </nav>

          {/* Topic header */}
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <LevelBadge level={topic.levelId} size="md" />
                {topic.readTime && (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[#6b7280]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {topic.readTime} min read
                  </span>
                )}
              </div>
              {isComplete && (
                <span
                  className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Completed
                </span>
              )}
            </div>

            <h1 className="font-mono font-bold text-3xl sm:text-4xl text-[#e8eaf0] mb-6 leading-tight">
              {topic.title}
            </h1>

            {/* What you'll learn */}
            {topic.whatYoullLearn?.length > 0 && (
              <div
                className="rounded-xl p-5 mb-8 border"
                style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}
              >
                <h3 className="font-mono text-sm font-semibold text-[#3b82f6] mb-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                  What You'll Learn
                </h3>
                <ul className="space-y-2">
                  {topic.whatYoullLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="mt-1 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span className="font-serif text-sm text-[#c5cad5]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lesson content */}
            <div className="mb-10">
              {blocks.map((block, i) => (
                <ContentBlock key={i} block={block} index={i} />
              ))}
            </div>

            {/* Code Playground */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-mono font-bold text-lg text-[#e8eaf0]">Interactive Playground</h2>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(250,204,21,0.1)', color: '#facc15', border: '1px solid rgba(250,204,21,0.3)' }}
                >
                  Try it yourself
                </span>
              </div>
              <CodePlayground
                defaultCode={`# Playground for: ${topic.title}\n# Write your code below and press Run!\n\nprint("Hello from PyPath!")`}
              />
            </div>

            {/* Mark Complete / Incomplete */}
            <div
              className="rounded-xl p-6 border mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: isComplete ? 'rgba(34,197,94,0.05)' : '#1a1f2e',
                borderColor: isComplete ? 'rgba(34,197,94,0.2)' : '#2a3040',
              }}
            >
              <div>
                <h3 className="font-mono font-semibold text-sm text-[#e8eaf0] mb-1">
                  {isComplete ? '✓ Topic Completed!' : 'Finished reading?'}
                </h3>
                <p className="font-serif text-xs text-[#9ca3af]">
                  {isComplete
                    ? `Completed on ${new Date(progress[id]?.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                    : 'Mark this topic as complete to track your progress.'}
                </p>
              </div>
              <button
                onClick={() => isComplete ? onMarkIncomplete?.(id) : onMarkComplete?.(id)}
                className="flex items-center gap-2 font-mono font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 flex-shrink-0"
                style={{
                  background: isComplete
                    ? 'rgba(239,68,68,0.1)'
                    : 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: isComplete ? '#ef4444' : '#fff',
                  border: isComplete ? '1px solid rgba(239,68,68,0.3)' : 'none',
                  boxShadow: isComplete ? 'none' : '0 4px 16px rgba(34,197,94,0.3)',
                }}
              >
                {isComplete ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Mark Incomplete
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Mark as Complete
                  </>
                )}
              </button>
            </div>

            {/* Related subtopics */}
            {topic.subtopics?.length > 0 && (
              <div className="mb-10">
                <h3 className="font-mono font-semibold text-sm text-[#6b7280] uppercase tracking-widest mb-3">
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topic.subtopics.map((sub, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: '#1e2435', color: '#9ca3af', border: '1px solid #2a3040' }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div className="border-t border-[#2a3040] pt-8 grid grid-cols-2 gap-4">
              {prev ? (
                <button
                  onClick={() => navigate(`/topic/${prev.id}`)}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-[#2a3040] hover:border-[#3a4155] transition-all text-left"
                  style={{ background: '#1a1f2e' }}
                >
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[#6b7280] group-hover:-translate-x-1 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Previous
                  </span>
                  <span className="font-mono text-sm font-medium text-[#e8eaf0] line-clamp-2">{prev.title}</span>
                </button>
              ) : (
                <div />
              )}

              {next ? (
                <button
                  onClick={() => navigate(`/topic/${next.id}`)}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-[#2a3040] hover:border-[#3a4155] transition-all text-right ml-auto w-full"
                  style={{ background: '#1a1f2e' }}
                >
                  <span className="flex items-center justify-end gap-1.5 font-mono text-xs text-[#6b7280] group-hover:translate-x-1 transition-transform">
                    Next
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                  <span className="font-mono text-sm font-medium text-[#e8eaf0] line-clamp-2">{next.title}</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Keyboard tip */}
            <div className="mt-4 flex justify-center">
              <span className="font-mono text-xs text-[#6b7280]">
                Press{' '}
                <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#2a3040', border: '1px solid #3a4155' }}>←</kbd>
                {' '}or{' '}
                <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#2a3040', border: '1px solid #3a4155' }}>→</kbd>
                {' '}to navigate between topics
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
