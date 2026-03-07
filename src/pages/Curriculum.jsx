import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { curriculum, allTopics, LEVELS } from '../data/curriculum';
import CurriculumTree from '../components/Curriculum/CurriculumTree';
import Footer from '../components/Layout/Footer';

const LEVEL_TABS = [
  { id: 'all', label: 'All Levels', emoji: '📚' },
  { id: 'beginner', label: 'Beginner', emoji: '🟢' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🟡' },
  { id: 'advanced', label: 'Advanced', emoji: '🔵' },
  { id: 'expert', label: 'Expert', emoji: '🔴' },
  { id: 'mastery', label: 'Mastery', emoji: '🟣' },
];

export default function CurriculumPage({ progress = {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Handle hash navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && LEVELS[hash]) {
      setActiveLevel(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  const totalCompleted = Object.values(progress).filter(v => v?.completed).length;
  const total = allTopics.length;

  const filteredCurriculum = activeLevel === 'all'
    ? curriculum
    : curriculum.filter(l => l.id === activeLevel);

  const levelStats = curriculum.map(level => {
    const levelTopics = level.sections.flatMap(s => s.topics);
    const done = levelTopics.filter(t => progress[t.id]?.completed).length;
    return { id: level.id, done, total: levelTopics.length };
  });

  return (
    <div className="min-h-screen pt-14" style={{ background: '#0f1117' }}>
      {/* Page header */}
      <div
        className="border-b border-[#2a3040] py-10"
        style={{ background: '#161b27' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-[#6b7280] uppercase tracking-widest">Curriculum</span>
            </div>
            <h1 className="font-mono font-bold text-3xl sm:text-4xl text-[#e8eaf0] mb-3">
              Python Learning Roadmap
            </h1>
            <p className="font-serif text-[#9ca3af] text-lg max-w-2xl leading-relaxed">
              {total} topics across 5 levels. Follow the path sequentially or jump to any section.
              Your progress is saved automatically.
            </p>

            {/* Overall progress bar */}
            <div className="mt-5 flex items-center gap-4">
              <div className="flex-1 max-w-sm h-2 rounded-full bg-[#2a3040] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3b82f6, #22c55e)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalCompleted / total) * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="font-mono text-sm text-[#9ca3af]">
                {totalCompleted}/{total} topics complete
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
              width="15" height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter topics by name or subtopic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl font-mono text-sm text-[#e8eaf0] placeholder-[#6b7280] outline-none transition-all"
              style={{
                background: '#1a1f2e',
                border: '1px solid #2a3040',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = '#2a3040'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#9ca3af]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Level tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {LEVEL_TABS.map(tab => {
            const stats = tab.id !== 'all' ? levelStats.find(s => s.id === tab.id) : null;
            const isActive = activeLevel === tab.id;
            const levelColor = tab.id !== 'all' ? LEVELS[tab.id]?.color : '#3b82f6';

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveLevel(tab.id);
                  if (tab.id !== 'all') {
                    setTimeout(() => {
                      const el = document.getElementById(tab.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
                className="flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded-lg transition-all duration-150"
                style={{
                  background: isActive ? `${levelColor}15` : '#1a1f2e',
                  color: isActive ? levelColor : '#9ca3af',
                  border: `1px solid ${isActive ? `${levelColor}40` : '#2a3040'}`,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {stats && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                    style={{
                      background: isActive ? `${levelColor}20` : '#2a3040',
                      color: isActive ? levelColor : '#6b7280',
                    }}
                  >
                    {stats.done}/{stats.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Level stats overview */}
        {activeLevel === 'all' && !searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {curriculum.map((level, i) => {
              const stats = levelStats.find(s => s.id === level.id);
              const pct = stats ? Math.round((stats.done / stats.total) * 100) : 0;
              const levelInfo = LEVELS[level.level];

              return (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => {
                    setActiveLevel(level.id);
                    document.getElementById(level.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl border text-left transition-all duration-150 hover:border-[#3a4155]"
                  style={{ background: '#1a1f2e', border: '1px solid #2a3040' }}
                >
                  <div className="text-xl mb-1">{level.icon}</div>
                  <div className="font-mono text-xs font-semibold text-[#e8eaf0] truncate">{level.title}</div>
                  <div className="font-mono text-xs text-[#6b7280] mb-2">{stats?.done}/{stats?.total}</div>
                  <div className="h-1 rounded-full bg-[#2a3040] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: levelInfo.color }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Curriculum tree */}
        <CurriculumTree
          progress={progress}
          searchQuery={searchQuery}
          filteredCurriculum={filteredCurriculum}
        />
      </div>

      <Footer />
    </div>
  );
}
