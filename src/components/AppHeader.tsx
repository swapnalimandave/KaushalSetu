import React from 'react';
import { Logo } from './ui/Logo';
import { OfflineBadge } from './ui/OfflineBadge';
import { LanguageCode } from '../types';

interface AppHeaderProps {
  currentLanguage: LanguageCode;
  onLanguageClick?: () => void;
  onOpenFacilitatorPortal?: () => void;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentLanguage,
  onLanguageClick,
  onOpenFacilitatorPortal,
  className = '',
}) => {
  const languageLabels: Record<LanguageCode, string> = {
    mr: 'मराठी',
    hi: 'हिंदी',
    en: 'English',
  };

  return (
    <header
      className={`
        w-full py-4 px-4 sm:px-6 md:px-8 border-b border-[#D9E1E5]/80 bg-[#FAF9F4]/90 backdrop-blur-xs
        sticky top-0 z-30 transition-colors
        ${className}
      `}
    >
      <div className="max-w-[1220px] mx-auto flex items-center justify-between gap-4">
        <Logo size="md" showTagline={true} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Offline Status indicator */}
          <div className="hidden xs:block">
            <OfflineBadge label="Offline Ready" />
          </div>

          {/* Facilitator Portal quick switch */}
          {onOpenFacilitatorPortal && (
            <button
              type="button"
              onClick={onOpenFacilitatorPortal}
              title="Open Facilitator & Mentor Management Desk"
              className="
                inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                bg-[#FAF9F4] border border-[#0A1931] text-[11px] font-bold text-[#0A1931]
                hover:bg-[#F4C84A] shadow-[1.5px_1.5px_0px_#0A1931]
                min-h-[40px] transition-all cursor-pointer select-none
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span className="hidden sm:inline">Facilitator Desk</span>
              <span className="sm:hidden">Mentor</span>
            </button>
          )}

          {/* Current language indicator / quick trigger */}
          {onLanguageClick && (
            <button
              type="button"
              onClick={onLanguageClick}
              aria-label={`Current language: ${languageLabels[currentLanguage]}. Click to change.`}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-[#FFFFFF] border border-[#D9E1E5] text-[13px] font-semibold text-[#0A1931]
                hover:border-[#4A7FA7] hover:bg-[#FAF9F4]
                shadow-[1px_1px_0px_rgba(10,25,49,0.05)]
                min-h-[40px] transition-all cursor-pointer select-none
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7FA7]
              "
            >
              <span className="w-2 h-2 rounded-full bg-[#58B98C]" />
              <span className="font-devanagari">{languageLabels[currentLanguage]}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
