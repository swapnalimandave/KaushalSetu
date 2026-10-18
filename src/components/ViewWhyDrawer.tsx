import React from 'react';
import { X, Check, AlertTriangle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { CareerOption, LanguageCode } from '../types';
import { SecondaryButton } from './ui/SecondaryButton';

interface ViewWhyDrawerProps {
  career: CareerOption | null;
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const ViewWhyDrawer: React.FC<ViewWhyDrawerProps> = ({
  career,
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen || !career) return null;

  const title = language === 'mr' ? career.titleMr : language === 'hi' ? career.titleHi : career.title;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-why-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className="
          relative w-full max-w-lg bg-[#FAF9F4] rounded-t-[24px] sm:rounded-[20px]
          border-t-2 sm:border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
          p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Career Fit Analysis · पर्याय विश्लेषण
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#DCECF3] text-[#0A1931]">
              {career.matchScore}% Match
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] hover:bg-[#DCECF3]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h3 id="view-why-title" className="text-[20px] sm:text-[22px] font-extrabold text-[#0A1931] font-sans">
            {title}
          </h3>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            {career.title} · {career.category}
          </p>
        </div>

        {/* 1. Why it fits */}
        <div className="mt-5 p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.04)]">
          <div className="flex items-center gap-2 mb-2 text-[#2E7D32]">
            <Check className="w-4.5 h-4.5 stroke-[2.75]" />
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#0A1931]">
              Why it fits your profile
            </h4>
          </div>
          <p className="text-[14px] font-medium text-[#17212B] leading-relaxed mb-3">
            {career.whyFitsShort}
          </p>
          <ul className="space-y-2 text-[13px] text-[#64748B]">
            {career.fitReasons.slice(0, 3).map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#58B98C] mt-1.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. What may be difficult */}
        <div className="mt-3.5 p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
          <div className="flex items-center gap-2 mb-2 text-[#B86B00]">
            <AlertTriangle className="w-4.5 h-4.5" />
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#0A1931]">
              What may be difficult / आव्हाने
            </h4>
          </div>
          <ul className="space-y-1.5 text-[13px] text-[#17212B]">
            {career.whatMayBeDifficult.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="text-[#B86B00] font-bold">·</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Training commitment & Current readiness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] uppercase">
              <Clock className="w-3.5 h-3.5 text-[#4A7FA7]" />
              <span>Training Commitment</span>
            </div>
            <p className="text-[14px] font-bold text-[#0A1931] mt-1">
              {career.trainingCommitment}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#58B98C]" />
              <span>Current Readiness</span>
            </div>
            <p className="text-[14px] font-bold text-[#0A1931] mt-1">
              {career.currentReadiness}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#D9E1E5] flex justify-end">
          <SecondaryButton size="md" fullWidth onClick={onClose}>
            Close Analysis
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
