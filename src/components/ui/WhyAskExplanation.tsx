import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface WhyAskExplanationProps {
  explanation: string;
  explanationMr?: string;
  explanationHi?: string;
  language?: string;
}

export const WhyAskExplanation: React.FC<WhyAskExplanationProps> = ({
  explanation,
  explanationMr,
  explanationHi,
  language = 'mr',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getLocalizedExplanation = () => {
    if (language === 'mr' && explanationMr) return explanationMr;
    if (language === 'hi' && explanationHi) return explanationHi;
    return explanation;
  };

  return (
    <div className="mt-2 text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="
          inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4A7FA7] hover:text-[#1A3D63]
          cursor-pointer py-1 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A7FA7]
        "
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Why are you asking this? / हा प्रश्न का?</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="mt-1.5 p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-[13px] text-[#17212B] leading-relaxed animate-in fade-in duration-150">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#F4C84A] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium font-devanagari">{getLocalizedExplanation()}</p>
              {language !== 'en' && (
                <p className="text-[12px] text-[#64748B] mt-1 font-sans">{explanation}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
