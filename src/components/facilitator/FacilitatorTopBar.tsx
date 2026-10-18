import React from 'react';
import { Menu, ArrowLeftRight, Bell, ShieldCheck, MapPin } from 'lucide-react';
import { FacilitatorSection, LanguageCode } from '../../types';
import { FACILITATOR_PROFILE_INFO } from '../../data/facilitatorData';

interface FacilitatorTopBarProps {
  currentSection: FacilitatorSection;
  onOpenMobileMenu: () => void;
  onSwitchToStudentView: () => void;
  language: LanguageCode;
  onLanguageChangeRequest: () => void;
  needsAttentionCount: number;
}

export const FacilitatorTopBar: React.FC<FacilitatorTopBarProps> = ({
  currentSection,
  onOpenMobileMenu,
  onSwitchToStudentView,
  language,
  onLanguageChangeRequest,
  needsAttentionCount,
}) => {
  const titles: Record<FacilitatorSection, { en: string; mr: string }> = {
    overview: { en: 'Facilitator Overview', mr: 'समन्वयक डॅशबोर्ड' },
    learners: { en: 'Learners Cohort', mr: 'प्रशिक्षणार्थी यादी' },
    learner_detail: { en: 'Learner Dossier', mr: 'प्रशिक्षणार्थी माहिती' },
    skillproof: { en: 'SkillProof Verification Queue', mr: 'कौशल्य पडताळणी रांग' },
    review_detail: { en: 'Practical Skill Rubric Evaluation', mr: 'प्रात्यक्षिक कौशल्य मूल्यमापन' },
    opportunities: { en: 'Opportunities & Applications', mr: 'रोजगार संधी व अर्ज साहाय्य' },
    reports: { en: 'Impact & Cohort Reports', mr: 'प्रगती व प्रभाव अहवाल' },
  };

  return (
    <header className="h-16 bg-[#FAF9F4] border-b border-[#D9E1E5] px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg border border-[#D9E1E5] bg-white text-[#0A1931]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-[#0A1931] tracking-tight">
              {language === 'mr' ? titles[currentSection]?.mr : titles[currentSection]?.en}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#DCECF3] text-[#2C5E82] border border-[#BACDD8]">
              Satara Center
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-[#556987]">
            {language === 'mr'
              ? 'ग्रामविकास ट्रस्ट • तुकडी २०२६-अ • एकूण २८ नोंदणीकृत'
              : 'Gramin Vikas Trust • Cohort 2026-A • 28 Enrolled Youth'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Language Switch */}
        <button
          onClick={onLanguageChangeRequest}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-[#D9E1E5] bg-white text-[#0A1931] hover:border-[#4A7FA7]"
        >
          <span className="font-devanagari">
            {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'EN'}
          </span>
        </button>

        {/* Switch to Student View */}
        <button
          onClick={onSwitchToStudentView}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-[#FAF9F4] border-2 border-[#0A1931] text-[#0A1931] text-xs font-bold
            hover:bg-[#F4C84A] shadow-[2px_2px_0px_#0A1931] transition-all cursor-pointer
          "
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'mr' ? 'विद्यार्थी डॅशबोर्ड' : 'Student View'}
          </span>
          <span className="sm:hidden">Student</span>
        </button>
      </div>
    </header>
  );
};
