import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
  Mic,
  ChevronRight,
  FileCheck,
  Bell,
  Download,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  LanguageCode,
  StudentProfile,
  CareerOption,
  LearningProgress,
  SkillProofData,
  ApplicationPreparation,
  Opportunity,
  StudentNotification,
} from '../types';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation, NavTab } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { LivelihoodJourneyWidget } from '../components/home/LivelihoodJourneyWidget';
import { HomeVoiceModal } from '../components/home/HomeVoiceModal';
import { studentHomeService } from '../services/home/studentHomeService';
import { getNextStep } from '../utils/nextStepEngine';
import { calculateJourneyStages, getStoredOutcome } from '../utils/journeyManager';
import { getStoredOpportunities, getStoredApplication } from '../utils/opportunityManager';
import { getStoredProgress } from '../utils/progressManager';
import { getStoredSkillProof } from '../utils/skillProofManager';

interface StudentHomeScreenProps {
  language: LanguageCode;
  profile: StudentProfile;
  career: CareerOption | null;
  onOpenEarnPath: () => void;
  onOpenLesson: (lessonId?: string) => void;
  onOpenSkillProof: () => void;
  onOpenProfileSkills: () => void;
  onOpenOpportunities: () => void;
  onOpenJourney: () => void;
  onOpenDownloads: () => void;
  onOpenFacilitatorPortal?: () => void;
  onLanguageChangeRequest: () => void;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({
  language,
  profile,
  career,
  onOpenEarnPath,
  onOpenLesson,
  onOpenSkillProof,
  onOpenProfileSkills,
  onOpenOpportunities,
  onOpenJourney,
  onOpenDownloads,
  onOpenFacilitatorPortal,
  onLanguageChangeRequest,
}) => {
  const [progress, setProgress] = useState<LearningProgress>(getStoredProgress());
  const [skillProof, setSkillProof] = useState<SkillProofData>(getStoredSkillProof());
  const [application, setApplication] = useState<ApplicationPreparation>(getStoredApplication());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(getStoredOpportunities());
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor network status with graceful fallback
  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Aggregate Student Home summary via dedicated service layer
  const homeSummary = studentHomeService.getStudentHomeSummary(profile, career);
  const nextStep = homeSummary.nextStep;
  const stages = homeSummary.journey.stages;
  const topOpportunities = homeSummary.opportunitySummary.topMatches;
  const updates = homeSummary.notifications;

  const handleNextStepClick = () => {
    switch (nextStep.ctaRoute) {
      case 'lesson_detail':
        onOpenLesson('charging-problems');
        break;
      case 'earnpath':
        onOpenEarnPath();
        break;
      case 'skillproof':
        onOpenSkillProof();
        break;
      case 'profile_skills':
        onOpenProfileSkills();
        break;
      case 'opportunities_placeholder':
        onOpenOpportunities();
        break;
      case 'journey':
        onOpenJourney();
        break;
      default:
        onOpenEarnPath();
        break;
    }
  };

  const greeting =
    language === 'mr'
      ? `नमस्कार, ${profile.name.split(' ')[0]}`
      : language === 'hi'
      ? `नमस्ते, ${profile.name.split(' ')[0]}`
      : `Namaskar, ${profile.name.split(' ')[0]}`;

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-24">
      {/* Mobile-First Student Header */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b-2 border-[#0A1931] px-4 sm:px-8 py-3">
        <div className="max-w-[1120px] mx-auto flex items-center justify-between gap-3">
          {/* Left: Brand + Student Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#F4C84A]">
              KS
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#4A7FA7] uppercase block leading-tight">
                KaushalSetu
              </span>
              <h1 className="text-[17px] sm:text-[19px] font-extrabold text-[#0A1931] tracking-tight font-sans leading-none">
                {greeting}
              </h1>
            </div>
          </div>

          {/* Right: Voice Trigger, Offline status, and Language Selector */}
          <div className="flex items-center gap-2">
            {/* Ask KaushalSetu Voice Assistant Button */}
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCECF3] hover:bg-[#B9D9EB] text-[#0A1931] text-xs font-bold border border-[#0A1931] transition-colors cursor-pointer"
              title="Ask KaushalSetu"
            >
              <Mic className="w-3.5 h-3.5 text-[#0A1931]" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'बोलून विचारा' : 'Ask Voice Guide'}
              </span>
            </button>

            {/* Offline status indicator */}
            {isOffline ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEE2E2] text-[#991B1B] text-xs font-bold border border-[#DC2626]/30">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Offline</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FAF9F4] text-[#1E6B52] text-xs font-semibold border border-[#D9E1E5]">
                <Wifi className="w-3.5 h-3.5 text-[#1E6B52]" />
                <span>Online</span>
              </span>
            )}

            {/* Facilitator Portal Switch */}
            {onOpenFacilitatorPortal && (
              <button
                type="button"
                onClick={onOpenFacilitatorPortal}
                title="Switch to Facilitator Dashboard"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#0A1931] bg-[#FAF9F4] hover:bg-[#F4C84A] text-[11px] font-bold text-[#0A1931] transition-all cursor-pointer shadow-[1px_1px_0px_#0A1931]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                <span className="hidden sm:inline">Facilitator</span>
                <span className="sm:hidden">Mentor</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              onClick={onLanguageChangeRequest}
              className="px-2.5 py-1.5 rounded-lg border border-[#0A1931] bg-[#FAF9F4] text-xs font-bold text-[#0A1931] hover:bg-[#DCECF3] cursor-pointer"
            >
              {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Offline Awareness Banner */}
      {isOffline && (
        <div className="bg-[#FEF3C7] border-b border-[#F59E0B] px-4 py-2 text-center text-[13px] font-medium text-[#92400E] flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-[#B45309]" />
          <span>
            {language === 'mr'
              ? 'तुम्ही ऑफलाइन आहात. सेव्ह केलेली प्रगती दाखवली जात आहे.'
              : 'You’re offline. Showing your saved progress.'}
          </span>
          <button
            type="button"
            onClick={onOpenDownloads}
            className="font-bold underline ml-1 hover:text-[#78350F] cursor-pointer"
          >
            {language === 'mr' ? 'ऑफलाइन धडे पहा' : 'View offline lessons'}
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Responsive Grid: 2 columns on desktop (lg:grid-cols-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* LEFT / MAIN COLUMN (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* 1. HERO: YOUR NEXT STEP CARD (Visually dominant editorial card) */}
            <section aria-labelledby="next-step-title" className="relative">
              <div className="relative rounded-[24px] bg-[#FFFFFF] border-3 border-[#0A1931] shadow-[6px_6px_0px_#0A1931] p-6 sm:p-8 overflow-hidden">
                {/* Visual sticker / tag */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <AnnotationTag variant="sticky" rotation={1}>
                    {nextStep.badgeText || 'Next Action ⭐'}
                  </AnnotationTag>
                </div>

                {/* Category kicker */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF6F61] animate-pulse" />
                  <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#EF6F61]">
                    {language === 'mr' ? nextStep.categoryLabelMr : nextStep.categoryLabel}
                  </span>
                </div>

                {/* Action Subheading */}
                <span className="text-[14px] font-bold text-[#4A7FA7] block mb-1">
                  {language === 'mr' ? nextStep.actionTypeMr : nextStep.actionType}
                </span>

                {/* Main Step Title */}
                <h2
                  id="next-step-title"
                  className="text-[24px] sm:text-[30px] font-extrabold text-[#0A1931] tracking-tight font-sans leading-tight"
                >
                  {language === 'mr' ? nextStep.titleMr : nextStep.title}
                </h2>

                {/* Duration / Metadata */}
                {nextStep.duration && (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] mt-2 mb-3">
                    <Clock className="w-4 h-4 text-[#4A7FA7]" />
                    <span>{nextStep.duration}</span>
                    <span>·</span>
                    <span>Week 2 · Mobile Device Diagnosis</span>
                  </div>
                )}

                {/* Support text / why this matters */}
                <p className="text-[15px] sm:text-[16px] text-[#17212B] font-devanagari leading-relaxed mb-6">
                  {language === 'mr' ? nextStep.descriptionMr : nextStep.description}
                </p>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <PrimaryButton
                    size="lg"
                    onClick={handleNextStepClick}
                    icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
                  >
                    {language === 'mr' ? nextStep.ctaLabelMr : nextStep.ctaLabel}
                  </PrimaryButton>

                  <button
                    type="button"
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-[#0A1931] bg-[#FAF9F4] text-[13px] font-bold text-[#0A1931] hover:bg-[#DCECF3] transition-colors cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-[#0A1931]" />
                    <span>{language === 'mr' ? 'ध्वनी स्पष्टीकरण ऐका' : 'Listen with Audio'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. LEARNING SNAPSHOT */}
            <section aria-labelledby="learning-snapshot-title">
              <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#4A7FA7]" />
                    <h3
                      id="learning-snapshot-title"
                      className="text-[17px] sm:text-[19px] font-extrabold text-[#0A1931] font-sans"
                    >
                      {language === 'mr' ? 'तुमचे शिकणे (Your Learning)' : 'Your Learning'}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenEarnPath}
                    className="text-xs font-bold text-[#1A3D63] hover:text-[#4A7FA7] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'mr' ? 'पूर्ण EarnPath पहा' : 'View Full EarnPath'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                        Active Pathway
                      </span>
                      <span className="text-[15px] font-extrabold text-[#0A1931]">
                        {career ? (language === 'mr' ? career.titleMr : career.title) : 'Mobile Device Repair Technician'}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#DCECF3] text-[#0A1931] self-start sm:self-center">
                      Week 2 · Diagnosis
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#F4C84A] rounded-full transition-all duration-300 border-r border-[#0A1931]"
                      style={{ width: `${progress.overallProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>
                      {language === 'mr'
                        ? '१६ पैकी ५ धडे पूर्ण'
                        : '5 of 16 lessons completed'}
                    </span>
                    <span className="font-bold text-[#0A1931]">
                      {progress.overallProgress}% complete
                    </span>
                  </div>
                </div>

                {/* Offline availability & Quick Lesson Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#D9E1E5]">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <Download className="w-4 h-4 text-[#1E6B52]" />
                    <span>
                      {language === 'mr'
                        ? '३ धडे इंटरनेटशिवाय उपलब्ध आहेत'
                        : '3 lessons available offline'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenDownloads}
                      className="text-xs font-bold text-[#64748B] hover:text-[#0A1931] underline cursor-pointer"
                    >
                      {language === 'mr' ? 'डाउनलोड्स व्यवस्थापित करा' : 'Manage Offline'}
                    </button>
                    <SecondaryButton size="sm" onClick={onOpenEarnPath}>
                      {language === 'mr' ? 'अभ्यास सुरू ठेवा' : 'Continue EarnPath'}
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. SKILLS SNAPSHOT */}
            <section aria-labelledby="skills-snapshot-title">
              <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#F4C84A]" />
                    <h3
                      id="skills-snapshot-title"
                      className="text-[17px] sm:text-[19px] font-extrabold text-[#0A1931] font-sans"
                    >
                      {language === 'mr' ? 'तुमची कौशल्ये (Your Skills)' : 'Your Skills'}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenProfileSkills}
                    className="text-xs font-bold text-[#1A3D63] hover:text-[#4A7FA7] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'mr' ? 'कौशल्य पोर्टफोलिओ पहा' : 'View Skill Portfolio'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 2 Skill Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Skill 1: Basic Mobile Device Diagnosis */}
                  <div className="p-4 rounded-xl bg-[#FAF9F4] border-2 border-[#0A1931] relative">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-[#64748B]">
                        SKILL #1
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E6B52]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <h4 className="text-[14px] font-extrabold text-[#0A1931]">
                      Basic Mobile Device Diagnosis
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1 font-devanagari">
                      {language === 'mr'
                        ? 'मल्टीमीटर तपासणी व सुरक्षित दोष शोध'
                        : 'Multimeter inspection & fault isolation'}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-[#D9E1E5] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>Instructor Shinde</span>
                      <span className="font-mono">KS-2026-MDR</span>
                    </div>
                  </div>

                  {/* Skill 2: Tool Safety Basics */}
                  <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] relative">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-[#64748B]">
                        SKILL #2
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                        <Clock className="w-3 h-3" />
                        <span>In Progress</span>
                      </span>
                    </div>
                    <h4 className="text-[14px] font-extrabold text-[#0A1931]">
                      Tool Safety & ESD Protocol
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1 font-devanagari">
                      {language === 'mr'
                        ? 'बॅटरी सुरक्षितता व अवजारे हाताळणी'
                        : 'Battery safety & ESD wristband handling'}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-[#D9E1E5] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>Week 1 Completed</span>
                      <span>Practice Done</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#64748B]">
                    {language === 'mr'
                      ? 'नवीन कौशल्ये SkillProof सादर केल्यावर पडताळली जातात.'
                      : 'Skills are certified by teachers after practical evidence.'}
                  </span>
                  <SecondaryButton size="sm" onClick={onOpenProfileSkills}>
                    {language === 'mr' ? 'प्रमाणित बॅज पहा' : 'View Badge'}
                  </SecondaryButton>
                </div>
              </div>
            </section>

            {/* 4. APPLICATION PREPARATION SNAPSHOT */}
            {application && (
              <section aria-labelledby="app-prep-title">
                <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#1E6B52]" />
                      <h3
                        id="app-prep-title"
                        className="text-[17px] sm:text-[19px] font-extrabold text-[#0A1931] font-sans"
                      >
                        {language === 'mr' ? 'अर्जाची तयारी (Application Progress)' : 'Application Progress'}
                      </h3>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#DCECF3] text-[#0A1931]">
                      3 of 5 Ready
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className="text-[14px] font-extrabold text-[#0A1931]">
                        {application.opportunityTitle}
                      </span>
                      <span className="text-xs font-bold text-[#64748B]">
                        {application.provider}
                      </span>
                    </div>

                    <p className="text-xs text-[#DC2626] font-bold flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Missing: 1 Passport size photo</span>
                    </p>

                    {/* Progress indicators */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {application.steps.map((st, i) => (
                        <div
                          key={st.id}
                          className={`h-2 rounded-full ${st.done ? 'bg-[#1E6B52]' : 'bg-[#CBD5E1]'}`}
                          title={st.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#64748B]">
                      {language === 'mr'
                        ? 'कागदपत्रे तयार झाल्यावर थेट दुकानदाराशी भेट घ्या.'
                        : 'Once ready, visit the shop with your verified credential.'}
                    </span>
                    <SecondaryButton size="sm" onClick={onOpenOpportunities}>
                      {language === 'mr' ? 'तयारी पूर्ण करा' : 'Continue Preparation'}
                    </SecondaryButton>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN (5 cols on desktop: Goal, Journey Tracker, Opportunities, Updates) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            
            {/* 1. GOAL CARD (Compact, near top) */}
            <section aria-labelledby="goal-card-title">
              <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A7FA7] block mb-1">
                  YOUR GOAL · तुमचे ध्येय
                </span>

                <h3
                  id="goal-card-title"
                  className="text-[18px] sm:text-[20px] font-extrabold text-[#0A1931] tracking-tight font-sans"
                >
                  {career ? (language === 'mr' ? career.titleMr : career.title) : 'Mobile Device Repair Technician'}
                </h3>

                <p className="text-[13px] text-[#64748B] mt-0.5">
                  4-week EarnPath · Hands-on technical pathway
                </p>

                {/* Progress bar */}
                <div className="mt-3.5 mb-2">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-[#64748B]">Pathway Progress</span>
                    <span className="text-[#0A1931]">{progress.overallProgress}% complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FAF9F4] border border-[#0A1931] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#F4C84A] rounded-full"
                      style={{ width: `${progress.overallProgress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D9E1E5] flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Target: 3 months</span>
                  <button
                    type="button"
                    onClick={onOpenEarnPath}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1931] hover:text-[#4A7FA7] cursor-pointer"
                  >
                    <span>View EarnPath</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* 2. LIVELIHOOD JOURNEY COMPACT WIDGET */}
            <section aria-label="Livelihood Journey">
              <LivelihoodJourneyWidget
                stages={stages}
                language={language}
                onOpenFullJourney={onOpenJourney}
              />
            </section>

            {/* 3. OPPORTUNITIES SNAPSHOT (Top 2-3 matches) */}
            <section aria-labelledby="opportunities-snapshot-title">
              <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#4A7FA7]" />
                    <h3
                      id="opportunities-snapshot-title"
                      className="text-[17px] font-extrabold text-[#0A1931] font-sans"
                    >
                      {language === 'mr' ? 'तुमच्यासाठी संधी' : 'Opportunities For You'}
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E6B52]">
                    4 Matches
                  </span>
                </div>

                <p className="text-[12px] text-[#64748B] mb-3">
                  {language === 'mr'
                    ? 'सातारा व नजीकच्या तालुक्यातील पडताळणी झालेल्या संधी:'
                    : 'Verified local openings matching your verified skill:'}
                </p>

                {/* 2 Cards */}
                <div className="space-y-2.5 mb-4">
                  {topOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#0A1931]/30 hover:border-[#0A1931] transition-all cursor-pointer"
                      onClick={onOpenOpportunities}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[13px] font-extrabold text-[#0A1931]">
                          {opp.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DCECF3] text-[#0A1931]">
                          {opp.matchLevel}
                        </span>
                      </div>
                      <span className="text-xs text-[#64748B] block truncate">
                        {opp.provider} · {opp.location}
                      </span>
                      <div className="mt-2 flex items-center justify-between text-xs font-bold text-[#1E6B52]">
                        <span>{opp.stipendOrSalary}</span>
                        <span className="text-[#4A7FA7] flex items-center">
                          Details <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <PrimaryButton fullWidth size="md" onClick={onOpenOpportunities}>
                  {language === 'mr' ? 'सर्व ४ संधी पहा' : 'See All Opportunities'}
                </PrimaryButton>
              </div>
            </section>

            {/* 4. PRACTICAL UPDATES & REMINDERS */}
            <section aria-labelledby="updates-title">
              <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-[#4A7FA7]" />
                  <h3
                    id="updates-title"
                    className="text-[16px] font-extrabold text-[#0A1931] font-sans"
                  >
                    {language === 'mr' ? 'महत्त्वाचे अपडेट्स' : 'Updates & Reminders'}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {updates.map((up) => (
                    <div
                      key={up.id}
                      className="p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-extrabold text-[#0A1931]">
                          {language === 'mr' ? up.titleMr : up.title}
                        </span>
                        <span className="text-[10px] text-[#64748B]">{up.timestamp}</span>
                      </div>
                      <p className="text-[#64748B] leading-relaxed font-devanagari">
                        {language === 'mr' ? up.bodyMr : up.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Voice Assistant Modal grounded in current state */}
      <HomeVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        nextStep={nextStep}
        progress={progress}
        onNavigate={(route) => {
          if (route === 'lesson_detail') onOpenLesson('charging-problems');
          else if (route === 'earnpath') onOpenEarnPath();
          else if (route === 'opportunities_placeholder') onOpenOpportunities();
          else if (route === 'downloads') onOpenDownloads();
          else onOpenEarnPath();
        }}
      />

      {/* Mobile Bottom Navigation (Home active) */}
      <BottomNavigation
        activeTab="home"
        language={language}
        onTabChange={(tab: NavTab) => {
          if (tab === 'home' || tab === 'discover') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'learn') {
            onOpenEarnPath();
          } else if (tab === 'opportunities' || tab === 'earn') {
            onOpenOpportunities();
          } else if (tab === 'profile' || tab === 'prove') {
            onOpenProfileSkills();
          }
        }}
      />
    </div>
  );
};
