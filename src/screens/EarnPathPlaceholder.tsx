import React from 'react';
import { ArrowLeft, Sparkles, BookOpen, Clock, Award, ShieldCheck } from 'lucide-react';
import { CareerOption, LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { SecondaryButton } from '../components/ui/SecondaryButton';

interface EarnPathPlaceholderProps {
  career: CareerOption;
  language: LanguageCode;
  onBackToPotential: () => void;
  onLanguageChangeRequest: () => void;
}

export const EarnPathPlaceholder: React.FC<EarnPathPlaceholderProps> = ({
  career,
  language,
  onBackToPotential,
  onLanguageChangeRequest,
}) => {
  const careerTitle = language === 'mr' ? career.titleMr : language === 'hi' ? career.titleHi : career.title;

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 max-w-[760px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col">
        {/* Navigation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={onBackToPotential}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Potential Profile & Recommendations</span>
          </button>
        </div>

        {/* Card */}
        <div className="relative rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 sm:p-8">
          <div className="absolute -top-3.5 right-6">
            <AnnotationTag variant="sticky" rotation={1}>
              Phase 3 Scope ⏳
            </AnnotationTag>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#58B98C]">
              4-Week Pathway Builder
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            Your EarnPath is being prepared
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-2 font-devanagari leading-relaxed">
            Selected Pathway: <span className="font-bold text-[#0A1931] bg-[#DCECF3] px-2 py-0.5 rounded">{careerTitle}</span> ({career.title}).
          </p>

          <div className="my-6 p-4.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#1A3D63] mb-3">
              Upcoming EarnPath Architecture:
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#17212B]">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">W1</span>
                <span>Week 1: Fundamentals, Tools & Disassembly (Offline Audio + Visual)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">W2</span>
                <span>Week 2: Multimeter Diagnostics & Common Fault Repair</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">W3</span>
                <span>Week 3: Practical SkillProof Verification Challenge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">W4</span>
                <span>Week 4: Local Shop Apprenticeship & Customer Coordination</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <SecondaryButton fullWidth size="md" onClick={onBackToPotential}>
              Back to Career Recommendations
            </SecondaryButton>
          </div>
        </div>
      </main>
    </div>
  );
};
