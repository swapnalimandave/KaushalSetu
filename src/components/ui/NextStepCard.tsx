import React from 'react';
import { ArrowRight } from 'lucide-react';

interface NextStepCardProps {
  title: string;
  description: string;
  stepNumber?: number | string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const NextStepCard: React.FC<NextStepCardProps> = ({
  title,
  description,
  stepNumber,
  badge,
  actionText = 'Continue',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] p-5 sm:p-6
        shadow-[2px_2px_0px_rgba(10,25,49,0.04)] hover:shadow-[3px_3px_0px_#DCECF3]
        hover:border-[#4A7FA7] transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {stepNumber && (
            <span className="w-5 h-5 rounded bg-[#FAF9F4] border border-[#0A1931] text-[11px] font-bold text-[#0A1931] flex items-center justify-center font-mono">
              {stepNumber}
            </span>
          )}
          {badge && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A3D63] bg-[#DCECF3] px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0A1931] font-sans">
        {title}
      </h3>
      <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <div className="mt-4 pt-3 border-t border-[#D9E1E5]/60 flex justify-end">
          <button
            type="button"
            onClick={onAction}
            className="
              inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7]
              min-h-[44px] px-2 cursor-pointer transition-colors
            "
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
