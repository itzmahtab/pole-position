'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface TrackDrawProps {
  path: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  duration?: number;
  className?: string;
}

export function TrackDraw({
  path,
  width = 800,
  height = 600,
  strokeColor = '#e10600',
  strokeWidth = 3,
  fillColor = 'rgba(225, 6, 0, 0.1)',
  duration = 3,
  className = '',
}: TrackDrawProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const pathEl = ref.current.querySelector('path');
      if (pathEl) {
        setPathLength(pathEl.getTotalLength());
      }
    }
  }, [path]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <motion.path
        d={path}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration, ease: 'easeInOut' },
          opacity: { duration: 0.3 },
        }}
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: 0,
        }}
      />

      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: duration * 0.8, duration: 0.5, type: 'spring' }}
      >
        <rect x={width / 2 - 15} y={height / 2 - 15} width="30" height="30" fill="none" />
      </motion.g>
    </svg>
  );
}
