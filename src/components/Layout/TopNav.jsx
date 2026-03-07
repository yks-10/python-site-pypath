import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../UI/SearchBar';
import { allTopics } from '../../data/curriculum';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/curriculum', label: 'Curriculum' },
  { to: '/interview', label: 'Interview' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function TopNav({ totalCompleted = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const total = allTopics.length;
  const pct = Math.round((totalCompleted / total) * 100);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(15,17,23,0.95)' : 'rgba(15,17,23,0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid #2a3040' : '1px solid rgba(42,48,64,0.3)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: '#1e2435' }}>
          <motion.div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #facc15)',
              width: `${pct}%`,
            }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
              }}
            >
              Py
            </div>
            <span className="font-mono font-bold text-base text-[#e8eaf0] group-hover:text-[#3b82f6] transition-colors">
              Path
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to ||
                (to !== '/' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className="font-mono text-sm px-3 py-1.5 rounded-lg transition-all duration-150"
                  style={{
                    color: isActive ? '#3b82f6' : '#9ca3af',
                    background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div className="hidden sm:block w-64 lg:w-80">
            <SearchBar compact placeholder="Search topics... (⌘K)" />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {totalCompleted > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {totalCompleted}/{total}
              </div>
            )}

            <button
              onClick={() => navigate('/compiler')}
              className="hidden md:flex items-center gap-1.5 font-mono text-sm px-4 py-1.5 rounded-lg transition-all duration-150"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(168,85,247,0.3)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Compiler
            </button>

            <button
              onClick={() => navigate('/curriculum')}
              className="hidden md:flex items-center gap-1.5 font-mono text-sm px-4 py-1.5 rounded-lg transition-all duration-150"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              }}
            >
              Start Learning
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-[#9ca3af] hover:text-[#e8eaf0] hover:bg-[#1e2435] transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[calc(3.5rem+2px)] left-0 right-0 z-30 border-b border-[#2a3040]"
            style={{ background: '#0f1117' }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              <div className="mb-2">
                <SearchBar placeholder="Search topics..." />
              </div>
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-mono text-sm px-4 py-3 rounded-lg transition-colors"
                  style={{
                    color: location.pathname === to ? '#3b82f6' : '#9ca3af',
                    background: location.pathname === to ? 'rgba(59,130,246,0.1)' : '#1a1f2e',
                  }}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { navigate('/compiler'); setMobileOpen(false); }}
                className="w-full mt-2 font-mono text-sm px-4 py-3 rounded-lg text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Compiler
              </button>
              <button
                onClick={() => { navigate('/curriculum'); setMobileOpen(false); }}
                className="w-full font-mono text-sm px-4 py-3 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                Start Learning →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
