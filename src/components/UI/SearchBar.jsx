import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';
import LevelBadge from './LevelBadge';

export default function SearchBar({ placeholder = 'Search topics...', compact = false, autoFocus = false }) {
  const { query, setQuery, results, clearSearch } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setActiveIdx(-1);
  }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      clearSearch();
      inputRef.current?.blur();
    }
  };

  const handleSelect = (topic) => {
    clearSearch();
    setIsFocused(false);
    navigate(`/topic/${topic.id}`);
  };

  const showDropdown = isFocused && query.length >= 2;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="relative flex items-center transition-all duration-200"
        style={{
          background: '#1a1f2e',
          border: `1px solid ${isFocused ? 'rgba(59,130,246,0.5)' : '#2a3040'}`,
          borderRadius: compact ? '8px' : '10px',
          boxShadow: isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
        }}
      >
        <svg
          className="absolute left-3 text-[#6b7280]"
          width={compact ? 14 : 16}
          height={compact ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent font-mono text-sm text-[#e8eaf0] placeholder-[#6b7280] outline-none"
          style={{
            padding: compact ? '7px 36px' : '10px 80px 10px 40px',
          }}
        />
        {!compact && (
          <div className="absolute right-3 flex items-center gap-1">
            {query ? (
              <button
                onClick={() => { clearSearch(); inputRef.current?.focus(); }}
                className="text-[#6b7280] hover:text-[#9ca3af] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ) : (
              <kbd
                className="font-mono text-xs px-1.5 py-0.5 rounded"
                style={{ background: '#2a3040', color: '#6b7280', border: '1px solid #3a4155', fontSize: '0.65rem' }}
              >
                ⌘K
              </kbd>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
            style={{
              background: '#1a1f2e',
              border: '1px solid #2a3040',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              maxHeight: '360px',
              overflowY: 'auto',
            }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center font-mono text-sm text-[#6b7280]">
                No topics match <span className="text-[#9ca3af]">"{query}"</span>
              </div>
            ) : (
              <>
                <div className="px-3 py-2 border-b border-[#2a3040]">
                  <span className="font-mono text-xs text-[#6b7280]">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {results.map((topic, i) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelect(topic)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{
                      background: i === activeIdx ? 'rgba(59,130,246,0.1)' : 'transparent',
                      borderBottom: i < results.length - 1 ? '1px solid rgba(42,48,64,0.5)' : 'none',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm font-medium text-[#e8eaf0] truncate">
                        {topic.title}
                      </div>
                      <div className="font-mono text-xs text-[#6b7280] mt-0.5 truncate">
                        {topic.levelLabel} → {topic.sectionTitle}
                      </div>
                    </div>
                    <LevelBadge level={topic.levelId} size="xs" />
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
