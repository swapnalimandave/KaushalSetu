import React from 'react';
import { Check } from 'lucide-react';
import { LanguageOption } from '../../types';

interface LanguageCardProps {
  option: LanguageOption;
  isSelected: boolean;
  onSelect: (id: LanguageOption['id']) => void;
  className?: string;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  option,
  isSelected,
  onSelect,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      aria-pressed={isSelected}
      className={`
        relative flex items-center justify-between w-full p-4 sm:p-5 text-left rounded-[16px]
        min-h-[64px] sm:min-h-[72px] transition-all duration-200 cursor-pointer select-none
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4A7FA7] focus-visible:ring-offset-2
        ${
          isSelected
            ? 'bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931]'
            : 'bg-[#FFFFFF] border border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.04)] hover:border-[#4A7FA7] hover:bg-[#FAF9F4]'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-3.5">
        {/* Language script avatar badge */}
        <div
          className={`
            w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg
            transition-colors duration-200
            ${
              isSelected
                ? 'bg-[#0A1931] text-[#FAF9F4]'
                : 'bg-[#DCECF3] text-[#1A3D63]'
            }
          `}
        >
          {option.id === 'mr' ? 'म' : option.id === 'hi' ? 'ह' : 'En'}
        </div>

        <div className="flex flex-col">
          <span className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] leading-tight font-devanagari">
            {option.nativeLabel}
          </span>
          <span className="text-[13px] sm:text-[14px] text-[#64748B] font-medium font-sans mt-0.5">
            {option.englishLabel} · <span className="text-[#4A7FA7]">{option.subtitle}</span>
          </span>
        </div>
      </div>

      {/* Checkbox indicator */}
      <div
        className={`
          w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0
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
