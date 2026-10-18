import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  SlidersHorizontal,
  Columns,
  Mic,
  Wrench,
  Zap,
  Headphones,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Wifi,
  Smartphone,
  ChevronRight,
  Info,
} from 'lucide-react';
import { StudentProfile, LanguageCode, CareerOption } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { OfflineBadge } from '../components/ui/OfflineBadge';
import { ViewWhyDrawer } from '../components/ViewWhyDrawer';
import { ComparePathsModal } from '../components/ComparePathsModal';
import { AskKaushalVoiceModal } from '../components/AskKaushalVoiceModal';
import { BottomNavigation, NavTab } from '../components/BottomNavigation';
import { recommendationService } from '../services/recommendations/recommendationService';
import { calculateCareerMatches } from '../utils/careerMatcher';

interface PotentialProfileScreenProps {
  profile: StudentProfile;
  language: LanguageCode;
  onBuildEarnPath: (career: CareerOption) => void;
  onChangePreferences: () => void;
  onLanguageChangeRequest: () => void;
  onOpenSkillProof?: () => void;
  onOpenOpportunities?: () => void;
  onBackToHome?: () => void;
  onOpenFacilitatorPortal?: () => void;
}

export const PotentialProfileScreen: React.FC<PotentialProfileScreenProps> = ({
  profile,
  language,
  onBuildEarnPath,
  onChangePreferences,
  onLanguageChangeRequest,
  onOpenSkillProof,
  onOpenOpportunities,
  onBackToHome,
  onOpenFacilitatorPortal,
}) => {
  const [selectedDrawerCareer, setSelectedDrawerCareer] = useState<CareerOption | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false);

  // Compute recommendation results deterministically from profile via recommendationService
  const deterministicResults = useMemo(() => recommendationService.calculateDeterministicMatches(profile), [profile]);
  const bestMatch = deterministicResults.bestMatch;
  const alternatives = deterministicResults.alternatives;

  const bestMatchTitle =
    language === 'mr' ? bestMatch.titleMr : language === 'hi' ? bestMatch.titleHi : bestMatch.title;

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      {/* Lightweight AppHeader */}
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-9">
        
        {/* Subtle Positive Reveal Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#58B98C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#58B98C] text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[2.75]" />
            </div>
            <div>
              <span className="text-[15px] sm:text-[16px] font-extrabold text-[#0A1931] block font-sans">
                We found a strong starting path for you
              </span>
              <span className="text-[12px] sm:text-[13px] text-[#64748B] block font-devanagari">
                तुमच्या आवडी आणि परिस्थितीनुसार सर्वोत्तम मार्ग तयार झाला आहे
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsVoiceGuideOpen(true)}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-[#FAF9F4] hover:bg-[#DCECF3] border border-[#0A1931] text-[13px] font-bold text-[#0A1931]
                shadow-[2px_2px_0px_#EF6F61] transition-all cursor-pointer min-h-[38px] select-none
              "
            >
              <Mic className="w-3.5 h-3.5 text-[#EF6F61]" />
              <span>Ask KaushalSetu</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: YOUR POTENTIAL PROFILE */}
        <section aria-labelledby="potential-profile-title" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7]">
                  Talent Discovery · क्षमता विश्लेषण
                </span>
              </div>
              <h1 id="potential-profile-title" className="text-[26px] sm:text-[34px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                Your Potential Profile
              </h1>
              <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-1 font-devanagari">
                Based on what you told us, these strengths stand out. · तुम्ही सांगितलेल्या उत्तरांवरून पुढील क्षमता ठळक दिसतात.
              </p>
            </div>

            <div className="mt-2 sm:mt-0">
              <AnnotationTag variant="sticky" rotation={-1}>
                what stood out ✏️
              </AnnotationTag>
            </div>
          </div>

          {/* 4 Main Strength Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
            {/* 1. Hands-on problem solver */}
            <div className="p-4 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center mb-3">
                  <Wrench className="w-5 h-5 text-[#F4C84A]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0A1931] font-sans">
                  Hands-on problem solver
                </h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">
                  You learn well by doing and working with real tools.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1A3D63] font-handwriting mt-3 block">
                #प्रॅक्टिकल काम
              </span>
            </div>

            {/* 2. Technical curiosity */}
            <div className="p-4 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#DCECF3] text-[#1A3D63] flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-[#EF6F61]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0A1931] font-sans">
                  Technical curiosity
                </h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">
                  You enjoy understanding how devices and systems work.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1A3D63] font-handwriting mt-3 block">
                #उपकरणे समजणे
              </span>
            </div>

            {/* 3. Practical learner */}
            <div className="p-4 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#58B98C]/20 text-[#17212B] flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5 text-[#58B98C]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0A1931] font-sans">
                  Practical learner
                </h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">
                  You prefer practice and audio guidance over long reading.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1A3D63] font-handwriting mt-3 block">
                #ऐकून व करून
              </span>
            </div>

            {/* 4. Goal-focused */}
            <div className="p-4 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F4] border border-[#0A1931] text-[#0A1931] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-[#0A1931]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0A1931] font-sans">
                  Goal-focused
                </h2>
                <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">
                  You want a pathway that can lead to earning relatively soon.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1A3D63] font-handwriting mt-3 block">
                #जलद रोजगार
              </span>
            </div>
          </div>

          {/* Memorable Editorial Tag Cluster */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mr-1">
              Core Strengths:
            </span>
            <span className="text-[12px] font-extrabold px-2.5 py-1 rounded bg-[#F4C84A]/30 text-[#0A1931] border border-[#F4C84A]">
              HANDS-ON
            </span>
            <span className="text-[12px] font-extrabold px-2.5 py-1 rounded bg-[#DCECF3] text-[#1A3D63] border border-[#4A7FA7]/40">
              PRACTICAL
            </span>
            <span className="text-[12px] font-extrabold px-2.5 py-1 rounded bg-[#EF6F61]/15 text-[#0A1931] border border-[#EF6F61]/60">
              TECHNICAL
            </span>
            <span className="text-[12px] font-extrabold px-2.5 py-1 rounded bg-[#58B98C]/20 text-[#0A1931] border border-[#58B98C]">
              QUICK-TO-APPLY
            </span>
          </div>
        </section>

        {/* SECTION 2: CONSTRAINT SUMMARY ("What we considered") */}
        <section aria-labelledby="constraints-title" className="mb-10">
          <div className="p-5 rounded-[20px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF6F61]" />
                <h2 id="constraints-title" className="text-[16px] sm:text-[18px] font-bold text-[#0A1931] font-sans">
                  What we considered · वास्तववादी निकष
                </h2>
              </div>
              <button
                type="button"
                onClick={onChangePreferences}
                className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Change preferences</span>
              </button>
            </div>

            {/* Compact chips */}
            <div className="flex flex-wrap gap-2 text-[13px] mb-3">
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] font-semibold flex items-center gap-1.5">
                <span className="text-[#58B98C]">✓</span> {profile.education || 'Class 10 education'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] font-semibold flex items-center gap-1.5">
                <span className="text-[#58B98C]">✓</span> Start earning {profile.earningTimeline || 'within 3 months'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#4A7FA7]" /> {profile.travelPreference || 'Nearby town'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] font-semibold flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#EF6F61]" /> Internet {profile.internetAccess || 'available sometimes'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] font-semibold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#0A1931]" /> {profile.deviceAccess || 'Android smartphone'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] font-semibold flex items-center gap-1.5">
                <span className="text-[#58B98C]">✓</span> Practical learning preference
              </span>
            </div>

            <p className="text-[13px] text-[#64748B] italic pt-2 border-t border-[#D9E1E5]/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#4A7FA7] shrink-0" />
              <span>We use your situation to avoid recommending paths that may be unrealistic right now.</span>
            </p>
          </div>
        </section>

        {/* SECTION 3: MAIN HERO CAREER RECOMMENDATION */}
        <section aria-labelledby="hero-recommendation-title" className="mb-12">
          <div className="relative rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[5px_5px_0px_#0A1931] p-6 sm:p-8 overflow-hidden">
            
            {/* Top Tape decoration */}
            <div className="absolute -top-3.5 left-12 w-24 h-5 bg-[#F4C84A]/60 -rotate-1 border-x border-[#0A1931]/15 pointer-events-none" />

            {/* Header with BEST MATCH tag & Compatibility Score */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest bg-[#0A1931] text-[#FAF9F4] px-3 py-1 rounded-md shadow-xs">
                  BEST MATCH
                </span>
                <span className="text-[12px] font-medium text-[#64748B] font-devanagari">
                  सर्वोत्तम जुळणारा करिअर पर्याय
                </span>
              </div>

              {/* Match Score Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#DCECF3] border border-[#4A7FA7]/40 shadow-xs">
                <span className="text-[18px] sm:text-[20px] font-black text-[#0A1931] font-mono leading-none">
                  {bestMatch.matchScore}%
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A3D63] leading-none">
                  Profile Match
                </span>
              </div>
            </div>

            {/* Career Title */}
            <h2 id="hero-recommendation-title" className="text-[26px] sm:text-[34px] font-extrabold text-[#0A1931] tracking-tight leading-snug font-sans">
              {bestMatchTitle}
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#4A7FA7] font-semibold mt-0.5">
              {bestMatch.title} · {bestMatch.category}
            </p>
            <p className="text-[14px] text-[#64748B] mt-2 font-devanagari leading-relaxed">
              {language === 'mr' ? bestMatch.descriptionMr : language === 'hi' ? bestMatch.descriptionHi : bestMatch.description}
            </p>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 my-5">
              {bestMatch.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-bold text-[#17212B] bg-[#FAF9F4] border border-[#D9E1E5] px-2.5 py-1 rounded-md"
                >
                  · {tag}
                </span>
              ))}
            </div>

            {/* 2-Column layout: Why This Fits You + Fit Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 pt-5 border-t border-[#D9E1E5]">
              
              {/* Column 1: Why this fits you */}
              <div className="lg:col-span-7">
                <h3 className="text-[16px] font-bold text-[#0A1931] mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#58B98C] text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <span>Why this fits you · हा पर्याय का योग्य आहे</span>
                </h3>

                <ul className="space-y-2.5">
                  {(language === 'mr' ? bestMatch.fitReasonsMr : bestMatch.fitReasons).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#17212B]">
                      <span className="w-5 h-5 rounded-md bg-[#58B98C]/20 text-[#58B98C] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Fit Breakdown Status Indicators */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#0A1931] mb-3">
                  Fit Breakdown Status
                </h4>

                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center justify-between py-1 border-b border-[#D9E1E5]/60">
                    <span className="text-[#64748B]">Interest match</span>
                    <span className="font-bold text-[#2E7D32] bg-[#58B98C]/20 px-2 py-0.5 rounded">
                      {bestMatch.fitBreakdown.interestMatch}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#D9E1E5]/60">
                    <span className="text-[#64748B]">Current skills</span>
                    <span className="font-bold text-[#1A3D63] bg-[#DCECF3] px-2 py-0.5 rounded">
                      {bestMatch.fitBreakdown.currentSkills}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#D9E1E5]/60">
                    <span className="text-[#64748B]">Learning style</span>
                    <span className="font-bold text-[#2E7D32] bg-[#58B98C]/20 px-2 py-0.5 rounded">
                      {bestMatch.fitBreakdown.learningStyle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#D9E1E5]/60">
                    <span className="text-[#64748B]">Time to earning</span>
                    <span className="font-bold text-[#1A3D63] bg-[#DCECF3] px-2 py-0.5 rounded">
                      {bestMatch.fitBreakdown.timeToEarning}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#D9E1E5]/60">
                    <span className="text-[#64748B]">Travel requirement</span>
                    <span className="font-bold text-[#0A1931] bg-[#FAF9F4] border border-[#D9E1E5] px-2 py-0.5 rounded">
                      {bestMatch.fitBreakdown.travelRequirement}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#64748B]">Device / internet fit</span>
                    <span className="font-bold text-[#0A1931] bg-[#FAF9F4] border border-[#D9E1E5] px-2 py-0.5 rounded">
                      {bestMatch.fitBreakdown.deviceInternetFit}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Caution / Reality check: "What you may need to improve" */}
            <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#B86B00]/40 my-6">
              <div className="flex items-center gap-2 mb-2 text-[#B86B00]">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#0A1931]">
                  What you may need to improve · पुढील तयारी
                </h4>
              </div>
              <p className="text-[13px] text-[#64748B] mb-2.5">
                To become ready for this path, these are the next practical skills to build:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-[#17212B]">
                {(language === 'mr' ? bestMatch.skillsToImproveMr : bestMatch.skillsToImprove).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B86B00] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Snapshot: "What this path looks like" */}
            <div className="p-4.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] my-6">
              <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#0A1931] mb-3">
                What this path looks like · कामाचे स्वरूप
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[13px]">
                <div className="p-2.5 rounded-lg bg-[#FAF9F4]">
                  <span className="text-[11px] font-bold uppercase text-[#64748B] block">Learning Style</span>
                  <span className="font-semibold text-[#0A1931]">{bestMatch.pathwaySummary.learningStyle}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF9F4]">
                  <span className="text-[11px] font-bold uppercase text-[#64748B] block">Initial Equipment Need</span>
                  <span className="font-semibold text-[#0A1931]">{bestMatch.pathwaySummary.initialEquipmentNeed}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF9F4]">
                  <span className="text-[11px] font-bold uppercase text-[#64748B] block">Mobility</span>
                  <span className="font-semibold text-[#0A1931]">{bestMatch.pathwaySummary.mobility}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF9F4] sm:col-span-2 lg:col-span-3">
                  <span className="text-[11px] font-bold uppercase text-[#64748B] block">Typical Starting Path</span>
                  <span className="font-semibold text-[#0A1931]">{bestMatch.pathwaySummary.typicalStartingPath}</span>
                </div>
              </div>
            </div>

            {/* PRIMARY CTA: BUILD MY EARNPATH */}
            <div className="pt-4 border-t border-[#D9E1E5] flex flex-col sm:flex-row gap-3">
              <PrimaryButton
                size="lg"
                fullWidth
                onClick={() => onBuildEarnPath(bestMatch)}
                icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
                iconPosition="right"
              >
                Build My EarnPath
              </PrimaryButton>

              <SecondaryButton
                size="lg"
                onClick={() => setIsCompareModalOpen(true)}
                icon={<Columns className="w-4 h-4" />}
              >
                Compare Paths
              </SecondaryButton>
            </div>

          </div>
        </section>

        {/* SECTION 4: ALTERNATIVE CAREER PATHS */}
        <section aria-labelledby="alternatives-title" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="alternatives-title" className="text-[20px] sm:text-[22px] font-bold text-[#0A1931] font-sans">
                Other paths that could fit you
              </h2>
              <p className="text-[13px] text-[#64748B] font-devanagari">
                इतर व्यावहारिक पर्याय · तुम्ही हे मार्गसुद्धा निवडू शकता
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="text-[13px] font-bold text-[#4A7FA7] hover:underline cursor-pointer"
            >
              Compare All ↗
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {alternatives.map((alt) => {
              const altTitle = language === 'mr' ? alt.titleMr : language === 'hi' ? alt.titleHi : alt.title;

              return (
                <div
                  key={alt.id}
                  className="p-4.5 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex flex-col justify-between hover:border-[#4A7FA7] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Alternative
                      </span>
                      <span className="text-[12px] font-mono font-bold text-[#0A1931] bg-[#DCECF3] px-2 py-0.5 rounded">
                        {alt.matchScore}% match
                      </span>
                    </div>

                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#0A1931] font-sans leading-snug">
                      {altTitle}
                    </h3>
                    <span className="text-xs text-[#64748B] block mt-0.5">{alt.title}</span>

                    <p className="text-[13px] text-[#17212B] mt-2 leading-relaxed">
                      {alt.whyFitsShort}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[11px] font-medium text-[#1A3D63] bg-[#FAF9F4] border border-[#D9E1E5] px-2 py-0.5 rounded">
                        {alt.trainingDurationWeeks} wks training
                      </span>
                      <span className="text-[11px] font-medium text-[#1A3D63] bg-[#FAF9F4] border border-[#D9E1E5] px-2 py-0.5 rounded">
                        {alt.travelRequirement}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D9E1E5]/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedDrawerCareer(alt)}
                      className="text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] cursor-pointer"
                    >
                      View Why ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => onBuildEarnPath(alt)}
                      className="text-[12px] font-bold text-[#0A1931] hover:underline cursor-pointer"
                    >
                      Choose Path
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: CHANGE MY PREFERENCES FOOTNOTE TRIGGER */}
        <section className="p-5 rounded-[18px] bg-[#FAF9F4] border border-[#D9E1E5] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-[15px] font-bold text-[#0A1931]">
              Want to explore different goals or skills?
            </h4>
            <p className="text-[13px] text-[#64748B]">
              You can change your education, travel distance or timeline at any point.
            </p>
          </div>
          <SecondaryButton
            size="md"
            onClick={onChangePreferences}
            icon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Change my preferences
          </SecondaryButton>
        </section>

      </main>

      {/* View Why Detail Drawer/Modal */}
      <ViewWhyDrawer
        career={selectedDrawerCareer}
        isOpen={Boolean(selectedDrawerCareer)}
        onClose={() => setSelectedDrawerCareer(null)}
        language={language}
      />

      {/* Compare Paths Modal */}
      <ComparePathsModal
        careers={[bestMatch, ...alternatives]}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        language={language}
      />

      {/* Contextual Ask KaushalSetu Voice Guide Modal */}
      <AskKaushalVoiceModal
        career={bestMatch}
        isOpen={isVoiceGuideOpen}
        onClose={() => setIsVoiceGuideOpen(false)}
        language={language}
      />

      {/* Mobile Bottom Navigation (Discover Tab active) */}
      <BottomNavigation
        activeTab="discover"
        language={language}
        onTabChange={(tab: NavTab) => {
          if (tab === 'home' && onBackToHome) {
            onBackToHome();
          } else if (tab === 'learn') {
            onBuildEarnPath(bestMatch);
          } else if ((tab === 'prove' || tab === 'profile') && onOpenSkillProof) {
            onOpenSkillProof();
          } else if ((tab === 'earn' || tab === 'opportunities') && onOpenOpportunities) {
            onOpenOpportunities();
          }
        }}
      />
    </div>
  );
};
