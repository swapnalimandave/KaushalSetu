import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Smartphone, Check } from 'lucide-react';
import { LanguageCode, LanguageOption } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { LanguageCard } from '../components/ui/LanguageCard';
import { VoiceButton } from '../components/ui/VoiceButton';
import { OfflineBadge } from '../components/ui/OfflineBadge';

interface WelcomeScreenProps {
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onStartJourney: () => void;
  onContinueExisting: () => void;
  onOpenVoice: () => void;
  onOpenFacilitatorPortal?: () => void;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'mr',
    nativeLabel: 'मराठी',
    englishLabel: 'Marathi',
    subtitle: 'स्थानिक भाषा व आवाज',
  },
  {
    id: 'hi',
    nativeLabel: 'हिंदी',
    englishLabel: 'Hindi',
    subtitle: 'सरल संवाद व मार्गदर्शन',
  },
  {
    id: 'en',
    nativeLabel: 'English',
    englishLabel: 'English',
    subtitle: 'Standard & Accessible',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedLanguage,
  onLanguageChange,
  onStartJourney,
  onContinueExisting,
  onOpenVoice,
  onOpenFacilitatorPortal,
}) => {
  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      {/* Header with logo, tagline, offline status, and facilitator portal switch */}
      <AppHeader
        currentLanguage={selectedLanguage}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      {/* Main Content Area: Responsive Editorial Layout */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column / Mobile Top: Editorial Hero & Visual Journey */}
          <section className="lg:col-span-7 flex flex-col">
            
            {/* Handcrafted annotation tags cluster */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
              <AnnotationTag color="coral" rotation={-1}>
                VOICE FIRST
              </AnnotationTag>
              <AnnotationTag color="blue" rotation={1}>
                WORKS OFFLINE
              </AnnotationTag>
              <AnnotationTag color="yellow" rotation={-1}>
                मराठी • हिंदी
              </AnnotationTag>
              <AnnotationTag color="green" rotation={0}>
                REAL OPPORTUNITIES
              </AnnotationTag>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold text-[#0A1931] tracking-tight leading-[1.12] font-sans">
              Find what you're good at.{' '}
              <span className="relative inline-block text-[#0A1931]">
                <span className="relative z-10">Learn it.</span>
                <span
                  className="absolute bottom-1.5 left-0 right-0 h-3 bg-[#F4C84A]/50 -z-0 -rotate-1 rounded-sm"
                  aria-hidden="true"
                />
              </span>{' '}
              Prove it.{' '}
              <span className="text-[#4A7FA7]">Earn from it.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-[16px] sm:text-[18px] text-[#17212B]/80 mt-4 sm:mt-5 max-w-[560px] leading-relaxed font-sans">
              Career guidance, practical skills and real opportunities — designed around your language, circumstances and goals.
            </p>

            {/* Visual Pathway (Hand-annotated editorial pathway: DISCOVER → LEARN → PROVE → EARN) */}
            <div className="mt-7 sm:mt-9 p-4 sm:p-5 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.05)] relative overflow-hidden">
              
              {/* Notebook tape element at the corner */}
              <div
                className="absolute -top-3.5 right-6 w-16 h-5 bg-[#F4C84A]/45 rotate-2 border-x border-[#0A1931]/10 pointer-events-none"
                aria-hidden="true"
              />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EF6F61]" />
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#0A1931]">
                    The 4-Step Pathway · कौशल्य प्रवास
                  </span>
                </div>
                <span className="font-handwriting text-[13px] text-[#4A7FA7] font-bold">
                  Step by step ↗
                </span>
              </div>

              {/* Steps progression */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2 pt-1">
                {/* Step 1: Discover */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0A1931] uppercase tracking-wider">01</span>
                    <span className="text-[11px] font-handwriting text-[#EF6F61] font-bold">आवड शोधा</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0A1931] block">
                      DISCOVER
                    </span>
                    <span className="text-[11px] text-[#64748B] block leading-tight mt-0.5">
                      Talent & aptitude
                    </span>
                  </div>
                </div>

                {/* Step 2: Learn */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0A1931] uppercase tracking-wider">02</span>
                    <span className="text-[11px] font-handwriting text-[#4A7FA7] font-bold">हळूहळू शिका</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0A1931] block">
                      LEARN
                    </span>
                    <span className="text-[11px] text-[#64748B] block leading-tight mt-0.5">
                      4-week EarnPath
                    </span>
                  </div>
                </div>

                {/* Step 3: Prove */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0A1931] uppercase tracking-wider">03</span>
                    <span className="text-[11px] font-handwriting text-[#58B98C] font-bold">कौशल्य दाखवा</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0A1931] block">
                      PROVE
                    </span>
                    <span className="text-[11px] text-[#64748B] block leading-tight mt-0.5">
                      SkillProof badge
                    </span>
                  </div>
                </div>

                {/* Step 4: Earn */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF9F4] border border-[#0A1931]/40 flex flex-col justify-between shadow-[2px_2px_0px_#F4C84A]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0A1931] uppercase tracking-wider">04</span>
                    <span className="text-[11px] font-handwriting text-[#0A1931] font-bold">रोजगार मिळवा</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0A1931] block">
                      EARN
                    </span>
                    <span className="text-[11px] text-[#64748B] block leading-tight mt-0.5">
                      Apprenticeship/Work
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-annotation */}
              <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/70 flex items-center justify-between text-[12px] text-[#64748B]">
                <span>Designed for local rural markets & district employment</span>
                <span className="hidden sm:inline font-mono text-[#0A1931] font-medium">100% Student-Centric</span>
              </div>
            </div>

            {/* Desktop prominent voice element in left column */}
            <div className="hidden lg:block mt-7">
              <VoiceButton onClick={onOpenVoice} />
            </div>

          </section>

          {/* Right Column / Mobile Bottom: Language Selection & Journey CTAs */}
          <section className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Language Selector Box */}
            <div className="relative rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-6">
              
              {/* Decorative handwritten note pointing to language selection */}
              <div className="absolute -top-3.5 right-6 z-10">
                <AnnotationTag variant="sticky" rotation={-2}>
                  start here ✏️
                </AnnotationTag>
              </div>

              {/* Section Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1931] font-sans">
                    Choose your language
                  </h2>
                </div>
                <p className="text-[14px] text-[#64748B] mt-0.5 font-sans">
                  You can change this anytime.
                </p>
                <p className="text-[12px] text-[#1A3D63] font-devanagari mt-0.5">
                  तुमची सोयीची भाषा निवडा · अपनी भाषा चुनें
                </p>
              </div>

              {/* Language Cards */}
              <div className="space-y-3 mb-6" role="radiogroup" aria-label="Select Language">
                {LANGUAGE_OPTIONS.map((option) => (
                  <LanguageCard
                    key={option.id}
                    option={option}
                    isSelected={selectedLanguage === option.id}
                    onSelect={onLanguageChange}
                  />
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="space-y-3">
                <PrimaryButton
                  fullWidth
                  size="lg"
                  onClick={onStartJourney}
                  icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
                  iconPosition="right"
                  aria-label="Start My Journey"
                >
                  Start My Journey
                </PrimaryButton>

                {/* Secondary Action */}
                <SecondaryButton
                  fullWidth
                  size="md"
                  onClick={onContinueExisting}
                  aria-label="Continue existing profile"
                >
                  Continue existing profile
                </SecondaryButton>

                {onOpenFacilitatorPortal && (
                  <button
                    type="button"
                    onClick={onOpenFacilitatorPortal}
                    className="w-full text-center py-2 text-[12px] font-bold text-[#1A3D63] hover:text-[#4A7FA7] underline decoration-dashed transition-colors cursor-pointer"
                  >
                    {selectedLanguage === 'mr'
                      ? 'मार्गदर्शक किंवा शिक्षक आहात? सुलभता कक्ष उघडा →'
                      : 'Are you a mentor or facilitator? Open Facilitator Desk →'}
                  </button>
                )}
              </div>

              {/* Small trust and accessibility footnote */}
              <div className="mt-5 pt-4 border-t border-[#D9E1E5] flex flex-col gap-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[12px] text-[#64748B]">
                  <Smartphone className="w-3.5 h-3.5 text-[#4A7FA7] shrink-0" />
                  <span>Designed for low-data connections & affordable smartphones.</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[12px] text-[#64748B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#58B98C] shrink-0" />
                  <span>Your information stays under your control.</span>
                </div>
              </div>

            </div>

            {/* Mobile Voice-First element (rendered below CTA block on mobile) */}
            <div className="block lg:hidden">
              <VoiceButton onClick={onOpenVoice} />
            </div>

          </section>

        </div>
      </main>

      {/* Subtle site footer */}
      <footer className="w-full py-5 px-4 text-center border-t border-[#D9E1E5]/80 bg-[#FAF9F4]">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0A1931]">KaushalSetu</span>
            <span aria-hidden="true">·</span>
            <span>Made for Bharat's youth</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Offline-Ready PWA Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Version 1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
