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
        return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400';
      case 'B':
        return 'bg-teal-950/70 border-teal-500/50 text-teal-300';
      case 'C':
        return 'bg-amber-950/70 border-amber-500/50 text-amber-400';
      case 'D':
        return 'bg-orange-950/70 border-orange-500/50 text-orange-400';
      case 'RED_FLAG':
        return 'bg-rose-950/80 border-rose-600 text-rose-300 font-bold';
      default:
        return 'bg-zinc-900 border-zinc-700 text-zinc-400';
    }
  };

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 border font-mono rounded ${sizeClass} ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {grade === 'RED_FLAG' ? 'RED FLAG' : `GRADE ${grade}`}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: 'CRITICAL' | 'WARNING' | 'INFO' | string }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300">
          Critical Defect
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
          Warning
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
          Informational
        </span>
      );
  }
};
