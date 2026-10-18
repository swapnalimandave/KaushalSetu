import React from 'react';
import { Check } from 'lucide-react';
import { OptionIcon } from './OptionIcon';
import { LanguageCode } from '../../types';

interface QuestionCardProps {
  id: string;
  label: string;
  labelMr: string;
  labelHi: string;
  iconName?: string;
  sublabel?: string;
  isSelected: boolean;
  isMultiSelect?: boolean;
  language: LanguageCode;
  onClick: () => void;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  label,
  labelMr,
  labelHi,
  iconName,
  sublabel,
  isSelected,
  isMultiSelect = false,
  language,
  onClick,
  className = '',
}) => {
  const getPrimaryLabel = () => {
    if (language === 'mr') return labelMr;
    if (language === 'hi') return labelHi;
    return label;
  };

  const getSecondaryLabel = () => {
    if (language === 'mr' || language === 'hi') {
      return label; // Show English alongside for bilingual clarity
    }
    return sublabel || null;
  };

  const primaryText = getPrimaryLabel();
  const secondaryText = getSecondaryLabel();

  return (
    <button
      type="button"
      onClick={onClick}
      role={isMultiSelect ? 'checkbox' : 'radio'}
      aria-checked={isSelected}
      className={`
        relative flex items-center justify-between w-full p-4 sm:p-4.5 rounded-[16px] text-left
        min-h-[56px] sm:min-h-[64px] transition-all duration-150 cursor-pointer select-none
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4A7FA7] focus-visible:ring-offset-2
        ${
          isSelected
            ? 'bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931]'
            : 'bg-[#FFFFFF] border border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.04)] hover:border-[#4A7FA7] hover:bg-[#FAF9F4]'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-3.5 pr-2">
        {iconName && (
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
              ${
                isSelected
                  ? 'bg-[#0A1931] text-[#FAF9F4]'
                  : 'bg-[#DCECF3] text-[#1A3D63]'
              }
            `}
            aria-hidden="true"
          >
            <OptionIcon name={iconName} className="w-5 h-5 stroke-[2]" />
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-[16px] sm:text-[17px] font-bold text-[#0A1931] leading-snug font-devanagari">
            {primaryText}
          </span>
          {secondaryText && (
            <span className="text-[12px] sm:text-[13px] text-[#64748B] font-medium font-sans mt-0.5">
              {secondaryText}
            </span>
          )}
        </div>
      </div>

      {/* Indicator icon: Square for multi-select, Circle for single-select */}
      <div
        className={`
          w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center transition-all shrink-0
          ${isMultiSelect ? 'rounded-lg' : 'rounded-full'}
          ${
            isSelected
              ? 'bg-[#0A1931] text-white ring-2 ring-[#0A1931]'
              : 'border-2 border-[#D9E1E5] bg-[#FAF9F4] text-transparent'
          }
        `}
        aria-hidden="true"
      >
        <Check className={`w-4 h-4 stroke-[2.75] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </button>
  );
};
