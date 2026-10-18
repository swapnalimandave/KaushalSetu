import React from 'react';

interface AnnotationTagProps {
  children: React.ReactNode;
  color?: 'yellow' | 'green' | 'coral' | 'blue' | 'navy' | 'paper';
  rotation?: -2 | -1 | 0 | 1 | 2;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'badge' | 'sticky' | 'handwritten';
  icon?: React.ReactNode;
  className?: string;
}

export const AnnotationTag: React.FC<AnnotationTagProps> = ({
  children,
  color = 'yellow',
  rotation = 0,
  size = 'sm',
  variant = 'badge',
  icon,
  className = '',
}) => {
  const rotationClasses = {
    '-2': '-rotate-2',
    '-1': '-rotate-1',
    '0': 'rotate-0',
    '1': 'rotate-1',
    '2': 'rotate-2',
  };

  const colorStyles = {
    yellow: 'bg-[#F4C84A]/25 text-[#17212B] border-[#F4C84A]/80 shadow-[1px_1px_0px_#F4C84A]',
    green: 'bg-[#58B98C]/20 text-[#17212B] border-[#58B98C]/80 shadow-[1px_1px_0px_#58B98C]',
    coral: 'bg-[#EF6F61]/15 text-[#17212B] border-[#EF6F61]/70 shadow-[1px_1px_0px_#EF6F61]',
    blue: 'bg-[#DCECF3] text-[#0A1931] border-[#4A7FA7]/60 shadow-[1px_1px_0px_#4A7FA7]',
    navy: 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931] shadow-[2px_2px_0px_#1A3D63]',
    paper: 'bg-[#FAF9F4] text-[#17212B] border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.08)]',
  };

  const sizeStyles = {
    xs: 'text-[11px] px-2 py-0.5 tracking-wider uppercase font-bold',
    sm: 'text-[12px] px-2.5 py-1 tracking-wider uppercase font-bold',
    md: 'text-[13px] px-3 py-1.5 font-bold',
  };

  if (variant === 'sticky') {
    return (
      <span
        className={`
          inline-flex items-center gap-1.5 font-handwriting text-[#17212B] font-bold
          bg-[#F4C84A] px-2.5 py-1 rounded-[2px] shadow-[2px_2px_3px_rgba(0,0,0,0.1)]
          border border-[#E5B535] ${rotationClasses[rotation]} select-none
          ${className}
        `}
      >
        {icon}
        <span>{children}</span>
      </span>
    );
  }

  if (variant === 'handwritten') {
    return (
      <span
        className={`
          inline-flex items-center gap-1 font-handwriting text-[#1A3D63] font-bold text-sm sm:text-base
          ${rotationClasses[rotation]} select-none
          ${className}
        `}
      >
        {icon}
        <span>{children}</span>
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-sans rounded-md border
        transition-transform duration-200 select-none
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${rotationClasses[rotation]}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
