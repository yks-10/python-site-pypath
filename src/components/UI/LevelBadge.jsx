import { LEVELS } from '../../data/curriculum';

const LEVEL_CONFIG = {
  beginner:     { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)',  text: '#22c55e' },
  intermediate: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.4)', text: '#facc15' },
  advanced:     { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', text: '#3b82f6' },
  expert:       { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  text: '#ef4444' },
  mastery:      { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)', text: '#a855f7' },
};

export default function LevelBadge({ level, size = 'sm', showEmoji = true, className = '' }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.beginner;
  const info = LEVELS[level];

  const sizes = {
    xs: { padding: '2px 8px', fontSize: '0.65rem' },
    sm: { padding: '3px 10px', fontSize: '0.75rem' },
    md: { padding: '5px 14px', fontSize: '0.875rem' },
    lg: { padding: '8px 18px', fontSize: '1rem' },
  };

  const s = sizes[size] || sizes.sm;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold font-mono ${className}`}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        padding: s.padding,
        fontSize: s.fontSize,
        letterSpacing: '0.02em',
      }}
    >
      {showEmoji && <span style={{ fontSize: '0.85em' }}>{info?.emoji}</span>}
      {info?.label}
    </span>
  );
}
