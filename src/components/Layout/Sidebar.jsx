import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { curriculum, LEVELS } from '../../data/curriculum';

function TopicItem({ topic, isActive, isComplete, onClick }) {
  const levelColor = LEVELS[topic.levelId]?.color || '#3b82f6';

  return (
    <button
      onClick={() => onClick(topic.id)}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 group"
      style={{
        background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
        borderLeft: isActive ? `2px solid #3b82f6` : '2px solid transparent',
      }}
    >
      <span
        className="flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all"
        style={{
          borderColor: isComplete ? '#22c55e' : (isActive ? '#3b82f6' : '#3a4155'),
          background: isComplete ? 'rgba(34,197,94,0.2)' : 'transparent',
        }}
      >
        {isComplete && (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
        {!isComplete && isActive && (
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />
        )}
      </span>
      <span
        className="font-mono text-xs leading-tight flex-1 truncate transition-colors"
        style={{ color: isActive ? '#e8eaf0' : isComplete ? '#6b7280' : '#9ca3af' }}
      >
        {topic.title}
      </span>
    </button>
  );
}

function SectionGroup({ section, levelId, levelColor, progress, activeTopicId, onTopicClick, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionHasActive = section.topics.some(t => t.id === activeTopicId);
  const completedCount = section.topics.filter(t => progress[t.id]?.completed).length;

  useEffect(() => {
    if (sectionHasActive) setOpen(true);
  }, [sectionHasActive]);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-[#1e2435] group"
      >
        <svg
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2.5"
          className="flex-shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="font-mono text-xs font-semibold text-[#9ca3af] group-hover:text-[#e8eaf0] flex-1 text-left truncate">
          {section.title}
        </span>
        {completedCount > 0 && (
          <span className="font-mono text-xs text-[#22c55e]">
            {completedCount}/{section.topics.length}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="ml-4 mt-0.5 border-l border-[#2a3040] pl-2 pb-1">
              {section.topics.map(topic => (
                <TopicItem
                  key={topic.id}
                  topic={{ ...topic, levelId }}
                  isActive={topic.id === activeTopicId}
                  isComplete={!!progress[topic.id]?.completed}
                  onClick={onTopicClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelGroup({ level, progress, activeTopicId, onTopicClick, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const levelInfo = LEVELS[level.level];
  const totalTopics = level.sections.reduce((acc, s) => acc + s.topics.length, 0);
  const completed = level.sections
    .flatMap(s => s.topics)
    .filter(t => progress[t.id]?.completed).length;
  const levelHasActive = level.sections.some(s => s.topics.some(t => t.id === activeTopicId));

  useEffect(() => {
    if (levelHasActive) setOpen(true);
  }, [levelHasActive]);

  return (
    <div
      className="mb-2 rounded-xl overflow-hidden"
      style={{ border: '1px solid #2a3040' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-[#1e2435]"
        style={{ background: open ? '#1a1f2e' : '#161b27' }}
      >
        <span className="text-base">{levelInfo.emoji}</span>
        <div className="flex-1 text-left min-w-0">
          <div className="font-mono text-xs font-bold text-[#e8eaf0] truncate">{level.title}</div>
          <div className="font-mono text-xs text-[#6b7280]">{level.subtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-1 rounded-full bg-[#2a3040] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalTopics ? (completed / totalTopics) * 100 : 0}%`,
                background: levelInfo.color,
              }}
            />
          </div>
          <svg
            width="12" height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            className="transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-2 py-2 border-t border-[#2a3040]">
              {level.sections.map((section, i) => (
                <SectionGroup
                  key={section.id}
                  section={section}
                  levelId={level.id}
                  levelColor={levelInfo.color}
                  progress={progress}
                  activeTopicId={activeTopicId}
                  onTopicClick={onTopicClick}
                  defaultOpen={levelHasActive && level.sections.some(s =>
                    s.id === section.id && s.topics.some(t => t.id === activeTopicId)
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ progress = {}, mobileOpen, onMobileClose }) {
  const { id: activeTopicId } = useParams();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#2a3040]">
        <h2 className="font-mono text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-0.5">
          Curriculum
        </h2>
        <p className="font-mono text-xs text-[#9ca3af]">
          {Object.values(progress).filter(v => v?.completed).length} topics complete
        </p>
      </div>
      <div
        ref={sidebarRef}
        className="flex-1 overflow-y-auto p-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a4155 #161b27' }}
      >
        {curriculum.map((level, i) => (
          <LevelGroup
            key={level.id}
            level={level}
            progress={progress}
            activeTopicId={activeTopicId}
            onTopicClick={handleTopicClick}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-[#2a3040]"
        style={{ background: '#0f1117' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              style={{ backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 flex flex-col border-r border-[#2a3040] lg:hidden"
              style={{ background: '#0f1117' }}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#2a3040]">
                <span className="font-mono font-bold text-sm text-[#e8eaf0]">Curriculum</span>
                <button
                  onClick={onMobileClose}
                  className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#e8eaf0] hover:bg-[#1e2435]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {curriculum.map((level, i) => (
                  <LevelGroup
                    key={level.id}
                    level={level}
                    progress={progress}
                    activeTopicId={activeTopicId}
                    onTopicClick={handleTopicClick}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
