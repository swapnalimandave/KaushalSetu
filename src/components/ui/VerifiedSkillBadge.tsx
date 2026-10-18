import React from 'react';
import { Check, ShieldCheck, Award } from 'lucide-react';
import { LanguageCode } from '../../types';

interface VerifiedSkillBadgeProps {
  skillTitle: string;
  skillTitleMr?: string;
  verifiedDate?: string;
  reviewerName?: string;
  language?: LanguageCode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedSkillBadge: React.FC<VerifiedSkillBadgeProps> = ({
  skillTitle,
  skillTitleMr,
  verifiedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  reviewerName = 'District Vocational Mentor',
  language = 'mr',
  size = 'md',
  className = '',
}) => {
  const displayTitle = language === 'mr' && skillTitleMr ? skillTitleMr : skillTitle;

  return (
    <div
      className={`
        relative inline-flex flex-col items-center text-center p-5 rounded-[20px]
        bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
        select-none ${className}
      `}
    >
      {/* Notebook seal tape accent */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#F4C84A]/60 rotate-1 border-x border-[#0A1931]/20 pointer-events-none" />

      {/* Seal Medallion */}
      <div className="relative my-2">
        <div className="w-16 h-16 rounded-full bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center border-2 border-[#FAF9F4] shadow-[2px_2px_0px_#58B98C] ring-4 ring-[#0A1931]/10">
          <Award className="w-8 h-8 text-[#F4C84A]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#58B98C] text-white flex items-center justify-center ring-2 ring-white">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>

      {/* Brand & Skill */}
      <span className="text-[10px] font-black uppercase tracking-widest text-[#4A7FA7] mt-1 font-mono">
        KAUSHALSETU SKILLPROOF
      </span>

      <h4 className="text-[17px] sm:text-[18px] font-extrabold text-[#0A1931] mt-1 font-sans leading-tight max-w-xs font-devanagari">
        {displayTitle}
      </h4>

      {language === 'mr' && (
        <span className="text-[11px] text-[#64748B] font-sans mt-0.5">{skillTitle}</span>
      )}

      {/* Verification status stamp */}
      <div className="mt-3 pt-2.5 border-t border-[#D9E1E5] w-full flex items-center justify-center gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-[#58B98C]/20 border border-[#58B98C] text-[#0A1931] font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#58B98C]" />
          Verified
        </span>
        <span className="text-[#64748B] font-mono">{verifiedDate}</span>
      </div>

      <span className="text-[10px] text-[#64748B] mt-1">
        Verified by {reviewerName}
      </span>
    </div>
  );
};
