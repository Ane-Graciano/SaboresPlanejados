import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { TimerStatus } from '../types/timer';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  status: TimerStatus;
  trackColor: string;
}

export function ProgressRing({ radius, stroke, progress, status, trackColor }: ProgressRingProps) {
  const norm = radius - stroke / 2;
  const circ = 2 * Math.PI * norm;
  const offset = circ * (1 - Math.max(0, Math.min(1, progress)));

  const fillColor = status === 'done' ? '#C46B3E' : status === 'paused' ? '#C4B4A4' : '#2E4A2E';

  return (
    <Svg width={radius * 2} height={radius * 2} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={radius} cy={radius} r={norm} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <Circle
        cx={radius}
        cy={radius}
        r={norm}
        fill="none"
        stroke={fillColor}
        strokeWidth={stroke}
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </Svg>
  );
}