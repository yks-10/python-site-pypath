import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

export default function CodeBlock({ code, language = 'python', filename, showLineNumbers = true }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code.trim();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#2a3040] my-4"
      style={{ background: '#0d1117' }}
    >
      {/* Header */}
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
          {filename && (
            <span className="font-mono text-xs text-[#6b7280] ml-2">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded transition-all duration-150"
            style={{
              background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(42,48,64,0.6)',
              color: copied ? '#22c55e' : '#9ca3af',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : '#3a4155'}`,
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <div className="flex" style={{ minWidth: 'max-content' }}>
          {showLineNumbers && (
            <div
              className="select-none flex flex-col items-end px-4 py-4 font-mono text-sm leading-relaxed"
              style={{ background: '#0d1117', color: '#3a4155', borderRight: '1px solid #1e2435', minWidth: '3rem' }}
            >
              {lines.map((_, i) => (
                <span key={i} style={{ lineHeight: '1.6' }}>{i + 1}</span>
              ))}
            </div>
          )}
          <pre
            className="!m-0 !p-4 flex-1 overflow-x-auto"
            style={{
              background: '#0d1117',
              borderRadius: 0,
              fontSize: '0.875rem',
              lineHeight: '1.6',
            }}
          >
            <code ref={codeRef} className={`language-${language}`}>
              {code.trim()}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
