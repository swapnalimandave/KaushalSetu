import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  subtitle?: string;
  stepNumber?: string | number;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  subtitle,
  stepNumber,
  className = '',
  align = 'left',
}) => {
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      <div className="inline-flex items-center gap-2">
        {stepNumber !== undefined && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#FAF9F4] border border-[#0A1931] text-[12px] font-bold text-[#0A1931] font-mono shadow-[1px_1px_0px_#0A1931]">
            {stepNumber}
          </span>
        )}
        <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1931] tracking-tight font-sans">
          {children}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-1 font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
