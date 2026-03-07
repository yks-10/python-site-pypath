import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { curriculum, allTopics, LEVELS, getTopicById } from '../data/curriculum';
import ProgressRing from '../components/UI/ProgressRing';
import Footer from '../components/Layout/Footer';

const LEVEL_COLORS = {
  beginner: '#22c55e',
  intermediate: '#facc15',
  advanced: '#3b82f6',
  expert: '#ef4444',
  mastery: '#a855f7',
};

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StreakCard({ streak, longestStreak, lastActivityDate }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const isActiveToday = lastActivityDate === todayStr;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-[#2a3040] overflow-hidden"
      style={{ background: '#1a1f2e' }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="font-mono text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-1">
              Learning Streak
            </h3>
            <div className="font-mono font-bold text-5xl" style={{ color: streak > 0 ? '#facc15' : '#6b7280' }}>
              {streak}
            </div>
            <div className="font-mono text-sm text-[#9ca3af] mt-0.5">
              {streak === 1 ? 'day' : 'days'} in a row
            </div>
          </div>
          <div className="text-5xl">{streak >= 7 ? '🔥' : streak >= 3 ? '✨' : streak > 0 ? '⚡' : '💤'}</div>
        </div>

        {/* 7-day grid */}
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            const isActive = isActiveToday && isToday;
            const dayIndex = d.getDay();

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-mono text-xs text-[#6b7280]">{days[dayIndex]}</span>
                <div
                  className="w-full aspect-square rounded-md transition-all"
                  style={{
                    background: isActive ? '#facc15' : isToday ? 'rgba(250,204,21,0.2)' : '#2a3040',
                    border: isToday ? '1px solid rgba(250,204,21,0.4)' : '1px solid transparent',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between font-mono text-xs text-[#6b7280]">
          <span>Best streak: <span className="text-[#facc15] font-semibold">{longestStreak} days</span></span>
          {lastActivityDate && (
            <span>Last active: {formatDate(lastActivityDate)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard({ progress = {}, streak = 0, longestStreak = 0, lastActivityDate = null, onReset, completedTopics = [] }) {
  const navigate = useNavigate();
  const total = allTopics.length;
  const totalCompleted = completedTopics.length;
  const overallPct = total ? Math.round((totalCompleted / total) * 100) : 0;

  const levelStats = curriculum.map(level => {
    const levelTopics = level.sections.flatMap(s => s.topics);
    const done = levelTopics.filter(t => progress[t.id]?.completed).length;
    const pct = levelTopics.length ? Math.round((done / levelTopics.length) * 100) : 0;
    return {
      ...level,
      topicCount: levelTopics.length,
      done,
      pct,
      color: LEVEL_COLORS[level.level],
    };
  });

  // Find continue topic: first incomplete topic after last completed
  const lastCompletedId = completedTopics[0]?.id;
  const lastIdx = lastCompletedId ? allTopics.findIndex(t => t.id === lastCompletedId) : -1;
  const continueTopic = lastIdx >= 0
    ? allTopics.slice(lastIdx + 1).find(t => !progress[t.id]?.completed)
    : allTopics[0];

  // Section completion breakdown
  const sectionStats = curriculum.flatMap(level =>
    level.sections.map(section => {
      const topics = section.topics;
      const done = topics.filter(t => progress[t.id]?.completed).length;
      return {
        levelId: level.id,
        sectionTitle: section.title,
        done,
        total: topics.length,
        pct: topics.length ? Math.round((done / topics.length) * 100) : 0,
        color: LEVEL_COLORS[level.level],
      };
    })
  ).filter(s => s.done > 0).sort((a, b) => b.pct - a.pct);

  return (
    <div className="min-h-screen pt-14" style={{ background: '#0f1117' }}>
      {/* Header */}
      <div className="border-b border-[#2a3040] py-10" style={{ background: '#161b27' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs text-[#6b7280] uppercase tracking-widest mb-2">Dashboard</div>
                <h1 className="font-mono font-bold text-3xl sm:text-4xl text-[#e8eaf0] mb-2">
                  Your Progress
                </h1>
                <p className="font-serif text-[#9ca3af] text-base">
                  {totalCompleted === 0
                    ? 'Begin your journey. Complete your first topic to see progress here.'
                    : `${totalCompleted} topics complete · ${overallPct}% through the full curriculum.`}
                </p>
              </div>
              {continueTopic && (
                <button
                  onClick={() => navigate(`/topic/${continueTopic.id}`)}
                  className="hidden sm:flex items-center gap-2 font-mono text-sm px-4 py-2.5 rounded-xl flex-shrink-0 transition-all duration-150"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  {totalCompleted === 0 ? 'Start Learning →' : 'Continue Learning →'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Topics Complete', value: totalCompleted, sub: `of ${total}`, color: '#22c55e' },
            { label: 'Overall Progress', value: `${overallPct}%`, sub: 'of curriculum', color: '#3b82f6' },
            { label: 'Day Streak', value: streak, sub: streak === 1 ? 'day' : 'days', color: '#facc15' },
            { label: 'Levels Started', value: levelStats.filter(l => l.done > 0).length, sub: 'of 5 levels', color: '#a855f7' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-[#2a3040] p-5"
              style={{ background: '#1a1f2e' }}
            >
              <div className="font-mono text-xs text-[#6b7280] uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="font-mono font-bold text-3xl" style={{ color: stat.color }}>{stat.value}</div>
              <div className="font-mono text-xs text-[#9ca3af] mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress rings + streak */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Progress rings by level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-[#2a3040] p-6"
            style={{ background: '#1a1f2e' }}
          >
            <h3 className="font-mono text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-5">
              Progress by Level
            </h3>
            <div className="flex flex-wrap items-center justify-around gap-4">
              {levelStats.map((level, i) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => navigate(`/curriculum#${level.id}`)}
                >
                  <ProgressRing
                    percent={level.pct}
                    size={100}
                    strokeWidth={7}
                    color={level.color}
                    label={level.title}
                    sublabel={`${level.done}/${level.topicCount}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Overall ring */}
            <div className="mt-6 pt-5 border-t border-[#2a3040] flex items-center justify-between">
              <div>
                <div className="font-mono text-sm font-semibold text-[#e8eaf0]">Overall Progress</div>
                <div className="font-mono text-xs text-[#6b7280]">{totalCompleted} of {total} topics</div>
              </div>
              <ProgressRing
                percent={overallPct}
                size={72}
                strokeWidth={6}
                color="#3b82f6"
              />
            </div>
          </motion.div>

          {/* Streak card */}
          <div>
            <StreakCard
              streak={streak}
              longestStreak={longestStreak}
              lastActivityDate={lastActivityDate}
            />

            {/* Continue CTA */}
            {continueTopic && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 rounded-2xl border border-[#2a3040] p-5"
                style={{ background: '#1a1f2e' }}
              >
                <h3 className="font-mono text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-3">
                  Continue Where You Left Off
                </h3>
                <button
                  onClick={() => navigate(`/topic/${continueTopic.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#2a3040] hover:border-[#3b82f6] transition-all group"
                  style={{ background: '#161b27' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${LEVEL_COLORS[continueTopic.levelId]}15` }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={LEVEL_COLORS[continueTopic.levelId] || '#3b82f6'}>
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-mono text-sm font-medium text-[#e8eaf0] truncate group-hover:text-white">
                      {continueTopic.title}
                    </div>
                    <div className="font-mono text-xs text-[#6b7280]">
                      {continueTopic.levelLabel} · {continueTopic.sectionTitle}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Section completion breakdown */}
        {sectionStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-[#2a3040] p-6 mb-8"
            style={{ background: '#1a1f2e' }}
          >
            <h3 className="font-mono text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-5">
              Section Completion
            </h3>
            <div className="space-y-3">
              {sectionStats.slice(0, 10).map((section, i) => (
                <div key={`${section.levelId}-${section.sectionTitle}`} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#9ca3af] w-36 truncate flex-shrink-0">
                    {section.sectionTitle}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#2a3040] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${section.pct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.05 }}
                      style={{ background: section.color }}
                    />
                  </div>
                  <span className="font-mono text-xs text-[#6b7280] w-16 text-right flex-shrink-0">
                    {section.done}/{section.total}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recently completed */}
        {completedTopics.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-[#2a3040] overflow-hidden"
            style={{ background: '#1a1f2e' }}
          >
            <div className="px-6 py-4 border-b border-[#2a3040]">
              <h3 className="font-mono text-xs font-semibold text-[#6b7280] uppercase tracking-widest">
                Recently Completed ({completedTopics.length})
              </h3>
            </div>
            <div className="divide-y divide-[#2a3040]">
              {completedTopics.slice(0, 12).map((item, i) => {
                const topic = getTopicById(item.id);
                if (!topic) return null;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    onClick={() => navigate(`/topic/${item.id}`)}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-[#1e2435] transition-colors text-left"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm text-[#e8eaf0] truncate">{topic.title}</div>
                      <div className="font-mono text-xs text-[#6b7280]">{topic.levelLabel} · {topic.sectionTitle}</div>
                    </div>
                    <span className="font-mono text-xs text-[#6b7280] flex-shrink-0">{formatDate(item.completedAt)}</span>
                  </motion.button>
                );
              })}
            </div>
            {completedTopics.length > 12 && (
              <div className="px-6 py-3 border-t border-[#2a3040] text-center">
                <span className="font-mono text-xs text-[#6b7280]">
                  +{completedTopics.length - 12} more topics completed
                </span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-[#2a3040] p-12 text-center"
            style={{ background: '#1a1f2e' }}
          >
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="font-mono font-bold text-xl text-[#e8eaf0] mb-2">No progress yet</h3>
            <p className="font-serif text-[#9ca3af] text-sm mb-6 max-w-sm mx-auto">
              Start your Python journey. Complete your first topic and watch your dashboard come to life.
            </p>
            <button
              onClick={() => navigate(allTopics[0] ? `/topic/${allTopics[0].id}` : '/curriculum')}
              className="font-mono text-sm px-5 py-2.5 rounded-xl transition-all duration-150"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              }}
            >
              Start with Topic #1 →
            </button>
          </motion.div>
        )}

        {/* Reset progress */}
        {totalCompleted > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                  onReset?.();
                }
              }}
              className="font-mono text-xs text-[#6b7280] hover:text-[#ef4444] transition-colors"
            >
              Reset all progress
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
