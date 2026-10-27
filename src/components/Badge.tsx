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
        return 'bg-[#EAF5F2] border-[#167C6B] text-[#0E5448] font-bold';
      case 'B':
        return 'bg-[#EEF4FA] border-[#2E6FBF] text-[#0B192C] font-semibold';
      case 'C':
        return 'bg-[#FEF6E9] border-[#D97706] text-[#92400E] font-semibold';
      case 'D':
        return 'bg-[#FDF1ED] border-[#E06B43] text-[#A73E18] font-semibold';
      case 'RED_FLAG':
        return 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B] font-extrabold';
      default:
        return 'bg-[#F5EFEB] border-[#DFC8B0] text-[#475E79]';
    }
  };

  const sizeClass = {
    sm: 'text-[10.5px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3.5 py-1 font-bold',
  }[size];

  return (
    <span className={`inline-block border font-mono rounded-sm ${sizeClass} ${getStyle()}`}>
      {grade === 'RED_FLAG' ? 'RED FLAG' : `GRADE ${grade}`}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: 'CRITICAL' | 'WARNING' | 'INFO' | string }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-block text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#FEF2F2] border border-[#DC2626] text-[#991B1B] font-bold">
          Critical Defect
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-block text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#FEF6E9] border border-[#D97706] text-[#92400E] font-semibold">
          Warning
        </span>
      );
    default:
      return (
        <span className="inline-block text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#F5EFEB] border border-[#DFC8B0] text-[#475E79]">
          Informational
        </span>
      );
  }
};
