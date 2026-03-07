import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEVELS } from '../../data/curriculum';

export default function TopicRow({ topic, isComplete, index = 0 }) {
  const navigate = useNavigate();
  const levelInfo = LEVELS[topic.levelId];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => navigate(`/topic/${topic.id}`)}
      className="group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
      style={{
        background: isComplete ? 'rgba(34,197,94,0.04)' : 'transparent',
        border: `1px solid ${isComplete ? 'rgba(34,197,94,0.15)' : 'rgba(42,48,64,0.5)'}`,
      }}
      whileHover={{
        background: isComplete ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.06)',
        borderColor: isComplete ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)',
        x: 3,
      }}
    >
      {/* Status indicator */}
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: isComplete ? '#22c55e' : '#3a4155',
          background: isComplete ? 'rgba(34,197,94,0.2)' : 'transparent',
        }}
      >
        {isComplete && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-medium text-[#e8eaf0] group-hover:text-white truncate">
            {topic.title}
          </span>
          {topic.readTime && (
            <span className="font-mono text-xs text-[#6b7280] flex-shrink-0">
              {topic.readTime}m read
            </span>
          )}
        </div>
        {topic.subtopics?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {topic.subtopics.slice(0, 4).map((sub, i) => (
              <span
                key={i}
                className="font-mono text-xs px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(42,48,64,0.5)', color: '#9ca3af' }}
              >
                {sub}
              </span>
            ))}
            {topic.subtopics.length > 4 && (
              <span className="font-mono text-xs text-[#6b7280]">
                +{topic.subtopics.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <svg
        width="14" height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        className="flex-shrink-0 transition-transform group-hover:translate-x-1"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.div>
  );
}
