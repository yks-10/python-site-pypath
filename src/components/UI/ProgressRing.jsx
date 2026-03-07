import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function ProgressRing({
  percent = 0,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  trackColor = '#2a3040',
  label,
  sublabel,
  animate: shouldAnimate = true,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const count = useMotionValue(0);
  const dashOffset = useTransform(count, v => circumference - (v / 100) * circumference);

  useEffect(() => {
    if (shouldAnimate) {
      const controls = animate(count, percent, {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      });
      return controls.stop;
    } else {
      count.set(percent);
    }
  }, [percent, shouldAnimate]);

  const displayPercent = useTransform(count, v => `${Math.round(v)}%`);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-mono font-bold text-white"
          style={{ fontSize: size > 100 ? '1.25rem' : '0.875rem' }}
        >
          {displayPercent}
        </motion.span>
        {label && (
          <span
            className="font-mono font-semibold text-center leading-tight px-1"
            style={{ fontSize: size > 100 ? '0.65rem' : '0.55rem', color: '#9ca3af', marginTop: '2px' }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="font-mono text-center"
            style={{ fontSize: '0.6rem', color: '#6b7280', marginTop: '1px' }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
