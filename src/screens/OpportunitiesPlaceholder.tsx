import React from 'react';
import { ArrowLeft, Briefcase, Sparkles, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';

interface OpportunitiesPlaceholderProps {
  language: LanguageCode;
  onBackToProfile: () => void;
  onBackToEarnPath: () => void;
  onLanguageChangeRequest: () => void;
}

export const OpportunitiesPlaceholder: React.FC<OpportunitiesPlaceholderProps> = ({
  language,
  onBackToProfile,
  onBackToEarnPath,
  onLanguageChangeRequest,
}) => {
  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-20">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 w-full max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col">
        {/* Navigation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={onBackToProfile}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Verified Profile</span>
          </button>
        </div>

        {/* Card */}
        <div className="relative rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 sm:p-8">
          <div className="absolute -top-3.5 right-6">
            <AnnotationTag variant="sticky" rotation={1}>
              Phase 5 Preview 💼
            </AnnotationTag>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-[#4A7FA7]" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Opportunity Matching Engine
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            Opportunity & Apprenticeship Matching
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-2 font-devanagari leading-relaxed">
            Your verified skill badge (<strong>Basic Mobile Device Diagnosis</strong>) is now linked to local market matchmaking.
          </p>

          <div className="my-6 p-4.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#1A3D63] mb-3">
              Upcoming Matching Architecture (Phase 5):
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#17212B]">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <span>Verified district smartphone repair shops seeking assistants</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <span>Government PMKVY & apprenticeship stipends</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <span>Single-tap WhatsApp coordination with shop owners</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#D9E1E5]">
            <SecondaryButton fullWidth size="md" onClick={onBackToProfile}>
              View Verified Profile & Badge
            </SecondaryButton>
            <SecondaryButton fullWidth size="md" onClick={onBackToEarnPath}>
              Return to EarnPath
            </SecondaryButton>
          </div>
        </div>
      </main>

      <BottomNavigation
        activeTab="earn"
        onTabChange={(tab) => {
          if (tab === 'learn') onBackToEarnPath();
          if (tab === 'prove') onBackToProfile();
        }}
      />
    </div>
  );
};
