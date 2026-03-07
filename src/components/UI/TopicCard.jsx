import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LevelBadge from './LevelBadge';
import { LEVELS } from '../../data/curriculum';

export default function TopicCard({ topic, isComplete = false, className = '' }) {
  const navigate = useNavigate();
  const levelColor = LEVELS[topic.levelId]?.color || '#3b82f6';

  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/topic/${topic.id}`)}
      className={`w-full text-left rounded-xl border transition-colors duration-200 overflow-hidden ${className}`}
      style={{
        background: '#1a1f2e',
        border: `1px solid ${isComplete ? 'rgba(34,197,94,0.3)' : '#2a3040'}`,
      }}
    >
      {/* Left accent bar */}
      <div className="flex">
        <div
          className="w-1 flex-shrink-0"
          style={{ background: isComplete ? '#22c55e' : levelColor, opacity: isComplete ? 1 : 0.6 }}
        />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-mono font-semibold text-sm text-[#e8eaf0] leading-tight">
              {topic.title}
            </h4>
            {isComplete ? (
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <LevelBadge level={topic.levelId} size="xs" />
            <span className="font-mono text-xs text-[#6b7280]">
              {topic.subtopics?.length || 0} subtopics
            </span>
          </div>

          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {topic.subtopics.slice(0, 3).map((sub, i) => (
                <span
                  key={i}
                  className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{ background: '#1e2435', color: '#9ca3af', border: '1px solid #2a3040' }}
                >
                  {sub}
                </span>
              ))}
              {topic.subtopics.length > 3 && (
                <span className="font-mono text-xs text-[#6b7280]">+{topic.subtopics.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
