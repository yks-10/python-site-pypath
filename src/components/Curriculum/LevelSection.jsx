import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS } from '../../data/curriculum';
import TopicRow from './TopicRow';

function SectionAccordion({ section, levelId, progress, searchQuery }) {
  const [open, setOpen] = useState(true);
  const allTopics = section.topics;
  const filteredTopics = searchQuery
    ? allTopics.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtopics?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allTopics;

  if (filteredTopics.length === 0) return null;

  const completedCount = filteredTopics.filter(t => progress[t.id]?.completed).length;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-[#1e2435]"
      >
        <div className="flex items-center gap-2">
          <svg
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            className="transition-transform"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="font-mono text-sm font-semibold text-[#e8eaf0]">{section.title}</span>
          <span className="font-mono text-xs text-[#6b7280]">({filteredTopics.length})</span>
        </div>
        {completedCount > 0 && (
          <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
            {completedCount}/{filteredTopics.length} done
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="space-y-1.5 pt-2 pl-4">
              {filteredTopics.map((topic, i) => (
                <TopicRow
                  key={topic.id}
                  topic={{ ...topic, levelId }}
                  isComplete={!!progress[topic.id]?.completed}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LevelSection({ level, progress, searchQuery, id }) {
  const levelInfo = LEVELS[level.level];
  const allLevelTopics = level.sections.flatMap(s => s.topics);
  const completed = allLevelTopics.filter(t => progress[t.id]?.completed).length;
  const total = allLevelTopics.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      id={id}
      className="rounded-2xl overflow-hidden border border-[#2a3040] mb-6"
      style={{ background: '#161b27' }}
    >
      {/* Level header */}
      <div
        className="px-6 py-5 border-b border-[#2a3040]"
        style={{
          background: `linear-gradient(135deg, rgba(${
            level.level === 'beginner' ? '34,197,94' :
            level.level === 'intermediate' ? '250,204,21' :
            level.level === 'advanced' ? '59,130,246' :
            level.level === 'expert' ? '239,68,68' :
            '168,85,247'
          },0.08) 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{level.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-xl font-bold text-[#e8eaf0]">{level.title}</h2>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${levelInfo.color}20`, color: levelInfo.color, border: `1px solid ${levelInfo.color}40` }}
                >
                  {level.subtitle}
                </span>
              </div>
              <p className="font-serif text-sm text-[#9ca3af] mt-0.5">{level.description}</p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-mono text-2xl font-bold" style={{ color: levelInfo.color }}>{pct}%</div>
            <div className="font-mono text-xs text-[#6b7280]">{completed}/{total} done</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full bg-[#2a3040] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: levelInfo.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="p-4">
        {level.sections.map(section => (
          <SectionAccordion
            key={section.id}
            section={section}
            levelId={level.id}
            progress={progress}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
