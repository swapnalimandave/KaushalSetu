import React from 'react';
import { ArrowLeft, Compass, CheckCircle2, Sparkles, BookOpen, Award, Briefcase } from 'lucide-react';
import { LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';

interface StudentOnboardingPlaceholderProps {
  language: LanguageCode;
  onBack: () => void;
  onLanguageChangeRequest?: () => void;
}

export const StudentOnboardingPlaceholder: React.FC<StudentOnboardingPlaceholderProps> = ({
  language,
  onBack,
  onLanguageChangeRequest,
}) => {
  const languageNames: Record<LanguageCode, string> = {
    mr: 'मराठी (Marathi)',
    hi: 'हिंदी (Hindi)',
    en: 'English',
  };

  const steps = [
    { id: '1', label: 'Language' },
    { id: '2', label: 'Profile' },
    { id: '3', label: 'Interests' },
    { id: '4', label: 'EarnPath' },
  ];

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {/* Back navigation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex items-center gap-2 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7]
              min-h-[44px] px-2 rounded-lg transition-colors cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7FA7]
            "
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Language Selection</span>
          </button>
        </div>

        {/* Progress header */}
        <div className="mb-6">
          <ProgressIndicator steps={steps} currentStepIndex={1} />
        </div>

        {/* Placeholder container */}
        <div className="relative rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 sm:p-8">
          {/* Notebook sticky note accent */}
          <div className="absolute -top-3.5 right-6">
            <AnnotationTag variant="sticky" rotation={1}>
              Phase 2 Ready ✍️
            </AnnotationTag>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Step 02 · Registration
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0A1931] font-sans">
            Student Onboarding
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-2 leading-relaxed">
            Welcome! You selected <span className="font-bold text-[#0A1931] bg-[#DCECF3] px-2 py-0.5 rounded">{languageNames[language]}</span>. 
            This onboarding flow will guide you through uncovering your natural talents, voice responses, and building your personalized 4-week EarnPath.
          </p>

          <div className="my-6 p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#1A3D63] mb-3">
              Upcoming Modules In The Next Step:
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#17212B]">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <span>Voice or touch-based student profile creation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <span>Vocational aptitude & practical interest discovery</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <span>Personalized 4-week EarnPath with offline-first materials</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <span>SkillProof verification & verified local apprenticeship matching</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <SecondaryButton fullWidth size="md" onClick={onBack}>
              Change Language
            </SecondaryButton>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-[#64748B] border-t border-[#D9E1E5]/60 mt-auto">
        KaushalSetu Prototype · Design System & Welcome Step Active
      </footer>
    </div>
  );
};
