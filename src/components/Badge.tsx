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
        return 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36] font-bold';
      case 'B':
        return 'bg-[#EAF5F3] border-[#18BAA4] text-[#0C4840] font-semibold';
      case 'C':
        return 'bg-[#FEF5ED] border-[#F6AC6D] text-[#8C460C] font-semibold';
      case 'D':
        return 'bg-[#FDF0E7] border-[#EF8D41] text-[#9E3E00] font-semibold';
      case 'RED_FLAG':
        return 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B] font-extrabold';
      default:
        return 'bg-[#F5EFE3] border-[#D5BA9B] text-[#4B635E]';
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
        <span className="inline-block text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] font-bold">
          Critical Defect
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-block text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#FEF5ED] border border-[#F6AC6D] text-[#8C460C] font-semibold">
          Warning
        </span>
      );
    default:
      return (
        <span className="inline-block text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#F5EFE3] border border-[#D5BA9B] text-[#4B635E]">
          Informational
        </span>
      );
  }
};
