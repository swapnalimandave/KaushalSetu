import React from 'react';
import { X, Check } from 'lucide-react';
import { LanguageCode, LanguageOption } from '../types';

interface LanguageSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'mr', nativeLabel: 'मराठी', englishLabel: 'Marathi', subtitle: 'स्थानिक भाषा व आवाज' },
  { id: 'hi', nativeLabel: 'हिंदी', englishLabel: 'Hindi', subtitle: 'सरल संवाद व मार्गदर्शन' },
  { id: 'en', nativeLabel: 'English', englishLabel: 'English', subtitle: 'Standard & Accessible' },
];

export const LanguageSwitcherModal: React.FC<LanguageSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-sm bg-[#FAF9F4] rounded-[20px] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <span className="text-[14px] font-bold text-[#0A1931]">
            Change Language · भाषा बदला
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang.id);
                  onClose();
                }}
                className={`
                  w-full p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left
                  ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[2px_2px_0px_#0A1931]'
                      : 'bg-[#FFFFFF] border-[#D9E1E5] hover:bg-[#FAF9F4] hover:border-[#4A7FA7]'
                  }
                `}
              >
                <div>
                  <span className="text-[16px] font-bold text-[#0A1931] block font-devanagari">
                    {lang.nativeLabel}
                  </span>
                  <span className="text-[12px] text-[#64748B]">
                    {lang.englishLabel}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#0A1931] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
