import React from 'react';

interface GradeBadgeProps {
  grade?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({ grade = 'UNVERIFIED', size = 'md' }) => {
  const getStyle = () => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'B':
        return 'bg-teal-500/10 border-teal-500/30 text-teal-300';
      case 'C':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'D':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'RED_FLAG':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-bold';
      default:
        return 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400';
    }
  };

  const sizeClass = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1 font-bold',
  }[size];

  return (
    <span className={`inline-block border font-mono rounded ${sizeClass} ${getStyle()}`}>
      {grade === 'RED_FLAG' ? 'RED FLAG' : `GRADE ${grade}`}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: 'CRITICAL' | 'WARNING' | 'INFO' | string }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-block text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
          Critical Defect
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-block text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
          Warning
        </span>
      );
    default:
      return (
        <span className="inline-block text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/60 text-zinc-400">
          Informational
        </span>
      );
  }
};
