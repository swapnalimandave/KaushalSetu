import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Check,
  Clock,
  Download,
  Lock,
  Play,
  Sparkles,
  Volume2,
  Wrench,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HardDrive,
  Mic,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Compass,
  Award,
} from 'lucide-react';
import { CareerOption, LanguageCode, WeekModule, Lesson } from '../types';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation, NavTab } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { NextStepCard } from '../components/ui/NextStepCard';
import { MOBILE_REPAIR_EARNPATH } from '../data/earnpathData';
import { getStoredProgress, saveStoredProgress } from '../utils/progressManager';
import { downloadWeekOffline, isWeekDownloaded } from '../utils/offlineManager';
import { getStoredSkillProof } from '../utils/skillProofManager';
import { PracticalTaskModal } from '../components/PracticalTaskModal';
import { AskKaushalVoiceModal } from '../components/AskKaushalVoiceModal';
import { OfflineSyncToast } from '../components/OfflineSyncToast';

interface EarnPathScreenProps {
  career: CareerOption;
  language: LanguageCode;
  onOpenLesson: (lessonId: string) => void;
  onOpenDownloads: () => void;
  onOpenSkillProof: () => void;
  onOpenProfileSkills?: () => void;
  onOpenOpportunities?: () => void;
  onBackToPotential?: () => void;
  onBackToHome?: () => void;
  onOpenFacilitatorPortal?: () => void;
  onLanguageChangeRequest: () => void;
}

export const EarnPathScreen: React.FC<EarnPathScreenProps> = ({
  career,
  language,
  onOpenLesson,
  onOpenDownloads,
  onOpenSkillProof,
  onOpenProfileSkills,
  onOpenOpportunities,
  onBackToPotential,
  onBackToHome,
  onOpenFacilitatorPortal,
  onLanguageChangeRequest,
}) => {
  // Entry transition state
  const [isBuildingPath, setIsBuildingPath] = useState(true);
  const [buildStepsComplete, setBuildStepsComplete] = useState<number>(0);

  // Progress state
  const [progress, setProgress] = useState(getStoredProgress());
  const [activeTaskModal, setActiveTaskModal] = useState<any | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [whyPlanExpanded, setWhyPlanExpanded] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Short 1.8s progressive onboarding transition
  useEffect(() => {
    const t1 = setTimeout(() => setBuildStepsComplete(1), 350);
    const t2 = setTimeout(() => setBuildStepsComplete(2), 750);
    const t3 = setTimeout(() => setBuildStepsComplete(3), 1150);
    const t4 = setTimeout(() => setBuildStepsComplete(4), 1550);
    const t5 = setTimeout(() => setIsBuildingPath(false), 1950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Sync progress on view
  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  const careerTitle =
    language === 'mr' ? career.titleMr : language === 'hi' ? career.titleHi : career.title;

  const isLessonDone = (lessonId: string) => progress.completedLessons.includes(lessonId);

  const handleDownloadWeek1 = () => {
    const updated = downloadWeekOffline(1, [
      'inside-a-smartphone',
      'essential-repair-tools',
      'safety-before-repair',
      'common-phone-problems',
    ]);
    setProgress(updated);
    setDownloadSuccessToast('Week 1 downloaded (~8 MB). All 4 lessons are ready offline!');
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  const handleTaskCompleted = (taskId: string) => {
    const updated = {
      ...progress,
      completedTasks: Array.from(new Set([...progress.completedTasks, taskId])),
    };
    saveStoredProgress(updated);
    setProgress(updated);
  };

  // Determine dynamic next step
  const getNextStepInfo = () => {
    if (!isLessonDone('inside-a-smartphone')) {
      return {
        badge: 'YOUR NEXT STEP',
        title: language === 'mr' ? 'स्मार्टफोनच्या आत काय असते?' : 'Inside a Smartphone',
        description: 'Explore the battery, motherboard, display, and camera connections (6 min).',
        actionText: 'Continue Learning',
        onAction: () => onOpenLesson('inside-a-smartphone'),
      };
    }
    if (!isLessonDone('essential-repair-tools')) {
      return {
        badge: 'YOUR NEXT STEP',
        title: language === 'mr' ? 'दुरुस्तीची मूलभूत अवजारे' : 'Essential Repair Tools',
        description: 'Learn how to handle screwdrivers, opening picks, and tweezers safely (5 min).',
        actionText: 'Start Lesson',
        onAction: () => onOpenLesson('inside-a-smartphone'), // routes to sample lesson environment
      };
    }
    return {
      badge: 'YOUR NEXT STEP',
      title: 'Week 1 Practical Task',
      description: 'Review components, tools and safety rules to complete Week 1 foundations.',
      actionText: 'Begin Practice',
      onAction: () => setActiveTaskModal(MOBILE_REPAIR_EARNPATH[0].task),
    };
  };

  const nextStep = getNextStepInfo();

  // ENTRY TRANSITION SCREEN
  if (isBuildingPath) {
    const transitionItems = [
      'Using your career goal',
      'Considering what you already know',
      'Adapting to your learning style',
      'Preparing low-data lessons',
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center notebook-ruled-bg p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0A1931] text-[#F4C84A] flex items-center justify-center mb-5 shadow-[3px_3px_0px_#F4C84A]">
          <BookOpen className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0A1931] font-sans">
          Building your learning path
        </h2>
        <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
          तुमच्यासाठी ४ आठवड्यांचा प्रॅक्टिकल मार्ग तयार होत आहे...
        </p>

        <div className="w-full max-w-sm mt-6 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931] text-left space-y-3">
          {transitionItems.map((item, index) => {
            const isDone = buildStepsComplete > index;
            return (
              <div key={item} className={`flex items-center gap-2.5 transition-opacity duration-200 ${isDone ? 'opacity-100' : 'opacity-35'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-[#58B98C] text-white' : 'border border-[#D9E1E5]'}`}>
                  {isDone ? '✓' : ''}
                </div>
                <span className="text-[13px] font-bold text-[#0A1931]">{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-20 sm:pb-12">
      {/* AppHeader with offline, language, and facilitator triggers */}
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        
        {/* Toast alert if download succeeds */}
        {downloadSuccessToast && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#58B98C] text-white font-bold text-[13px] shadow-[2px_2px_0px_#0A1931] flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        {/* HERO SECTION */}
        <section aria-labelledby="earnpath-hero-title" className="mb-8">
          <div className="p-6 sm:p-8 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] relative overflow-hidden">
            
            {/* Top Tape Accent */}
            <div className="absolute -top-3.5 right-10 w-20 h-5 bg-[#F4C84A]/60 rotate-1 border-x border-[#0A1931]/15 pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-[#0A1931] text-[#FAF9F4] px-3 py-1 rounded-md shadow-xs">
                YOUR EARNPATH · ४ आठवड्यांचा मार्ग
              </span>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F4] hover:bg-[#DCECF3] border border-[#0A1931] text-xs font-bold text-[#0A1931] shadow-[1px_1px_0px_#EF6F61] cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-[#EF6F61]" />
                <span>Ask KaushalSetu</span>
              </button>
            </div>

            <h1 id="earnpath-hero-title" className="text-[26px] sm:text-[36px] font-extrabold text-[#0A1931] tracking-tight leading-snug font-sans mt-2">
              {careerTitle}
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-1 font-devanagari max-w-2xl leading-relaxed">
              A practical 4-week pathway built around your current skills, learning style and goal.
            </p>

            {/* Practical Pathway Badges */}
            <div className="flex flex-wrap gap-2 mt-4 text-[12px] font-semibold text-[#17212B]">
              <span className="px-3 py-1 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                📅 4 weeks
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                ⏱ Approx. 15–25 min/day
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                🎧 Audio + visual lessons
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                🛠 Practical tasks
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#58B98C]/20 border border-[#58B98C] text-[#0A1931] font-bold">
                ✓ Offline available
              </span>
            </div>

            {/* Personalization Note Accordion */}
            <div className="mt-5 pt-3 border-t border-[#D9E1E5]">
              <button
                type="button"
                onClick={() => setWhyPlanExpanded(!whyPlanExpanded)}
                className="text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] flex items-center gap-1 cursor-pointer"
              >
                <span>Why this plan is built this way</span>
                {whyPlanExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {whyPlanExpanded && (
                <div className="mt-2 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-[13px] text-[#17212B] leading-relaxed animate-in fade-in">
                  <p className="font-devanagari">
                    You prefer practical and audio learning, have intermittent internet access and want to build job-ready skills quickly. Your pathway emphasizes short lessons, offline access and hands-on practice.
                  </p>
                  <p className="text-[#64748B] text-xs mt-1.5 font-devanagari">
                    तुम्हाला ऐकून व प्रत्यक्ष हाताने शिकणे आवडते म्हणून हा मार्ग ऑडिओ मार्गदर्शक आणि प्रॅक्टिकल टास्कवर आधारित आहे.
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 2-COLUMN LAYOUT: ROADMAP (LEFT) + PROGRESS & ACTIONS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT / MAIN COLUMN: 4-WEEK ROADMAP */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Roadmap Header & Status Key */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1931] font-sans">
                  4-Week Skill Roadmap · कौशल्याचा आराखडा
                </h2>
                <p className="text-[13px] text-[#64748B] font-devanagari">
                  Step-by-step practical progression from foundations to SkillProof.
                </p>
              </div>

              {/* Status Indicator Legend */}
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#58B98C] stroke-[3]" /> Done
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#0A1931]" /> Active
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#64748B]" /> Locked
                </span>
              </div>
            </div>

            {/* STACKED 4 WEEK BLOCKS */}
            {MOBILE_REPAIR_EARNPATH.map((week) => {
              const isWeek1 = week.weekNumber === 1;
              const isWeek2 = week.weekNumber === 2;
              const isLocked = week.weekNumber > 2 && progress.completedLessons.length < 4;
              const isDownloaded = isWeekDownloaded(week.weekNumber);

              // Accent borders
              const accentBorderClasses = {
                blue: 'border-l-4 border-l-[#4A7FA7]',
                yellow: 'border-l-4 border-l-[#F4C84A]',
                green: 'border-l-4 border-l-[#58B98C]',
                coral: 'border-l-4 border-l-[#EF6F61]',
              };

              return (
                <div
                  key={week.weekNumber}
                  className={`
                    rounded-[20px] bg-[#FFFFFF] border border-[#D9E1E5] p-5 sm:p-6 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]
                    transition-all ${accentBorderClasses[week.accentColor]}
                    ${isLocked ? 'opacity-85' : 'hover:shadow-[3px_3px_0px_#DCECF3]'}
                  `}
                >
                  {/* Week Title & Goal */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                          WEEK 0{week.weekNumber}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931]">
                          {week.theme}
                        </span>
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B]">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                        {!isLocked && isWeek1 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32]">
                            ● In Progress
                          </span>
                        )}
                      </div>

                      <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] mt-1 font-sans">
                        {language === 'mr' ? week.themeMr : week.theme}
                      </h3>
                      <p className="text-[13px] sm:text-[14px] text-[#64748B] mt-0.5 font-devanagari">
                        {language === 'mr' ? week.goalMr : week.goal}
                      </p>
                    </div>

                    {/* Offline download status per week */}
                    {isWeek1 && (
                      <div className="self-end sm:self-auto">
                        {isDownloaded ? (
                          <span className="text-xs font-bold text-[#2E7D32] bg-[#58B98C]/20 border border-[#58B98C] px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Offline Ready
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleDownloadWeek1}
                            className="text-xs font-bold text-[#0A1931] bg-[#FAF9F4] hover:bg-[#DCECF3] border border-[#0A1931] px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" /> Download (~8 MB)
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Special Milestone Card for Week 4 SkillProof */}
                  {week.weekNumber === 4 && (
                    <div className="mb-4 p-4 rounded-xl bg-[#FAF9F4] border-2 border-[#0A1931] shadow-[3px_3px_0px_#EF6F61]">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EF6F61] font-mono">
                          MILESTONE · अंतिम कौशल्य सिद्धता
                        </span>
                        <span className="text-xs font-bold text-[#2E7D32] bg-[#58B98C]/20 px-2 py-0.5 rounded">
                          AI Review + Mentor Verification
                        </span>
                      </div>
                      <h4 className="text-[16px] font-extrabold text-[#0A1931]">
                        SkillProof Project: Basic Mobile Device Diagnosis
                      </h4>
                      <p className="text-[13px] text-[#64748B] mt-1 font-devanagari">
                        Demonstrate your diagnostic inspection with photo and voice evidence. AI provides immediate preliminary guidance, followed by final verification from your district mentor.
                      </p>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={onOpenSkillProof}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A1931] hover:bg-[#1A3D63] text-white text-[13px] font-bold shadow-[2px_2px_0px_#F4C84A] cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-[#F4C84A]" />
                          <span>Submit SkillProof Project</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons List */}
                  <div className="space-y-2.5">
                    {week.lessons.map((lesson) => {
                      const isComplete = isLessonDone(lesson.id);
                      const isSample = lesson.id === 'inside-a-smartphone';

                      return (
                        <div
                          key={lesson.id}
                          className={`
                            p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all
                            ${
                              isComplete
                                ? 'bg-[#FAF9F4] border-[#D9E1E5]'
                                : isSample
                                ? 'bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[2px_2px_0px_#0A1931]'
                                : 'bg-[#FFFFFF] border-[#D9E1E5]'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold
                                ${
                                  isComplete
                                    ? 'bg-[#58B98C] text-white'
                                    : isSample
                                    ? 'bg-[#0A1931] text-[#F4C84A]'
                                    : 'bg-[#DCECF3] text-[#1A3D63]'
                                }
                              `}
                            >
                              {isComplete ? '✓' : lesson.order}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-[15px] sm:text-[16px] font-bold text-[#0A1931] font-sans">
                                  {language === 'mr' ? lesson.titleMr : lesson.title}
                                </h4>
                                {isSample && !isComplete && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4C84A] text-[#0A1931] px-1.5 py-0.2 rounded">
                                    Sample Ready
                                  </span>
                                )}
                              </div>

                              <p className="text-[12px] text-[#64748B] mt-0.5 font-devanagari">
                                {language === 'mr' ? lesson.summaryMr : lesson.summary}
                              </p>

                              <div className="flex items-center gap-2 mt-2 text-[11px] font-medium text-[#64748B]">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#4A7FA7]" /> {lesson.durationMinutes} min
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Volume2 className="w-3 h-3 text-[#58B98C]" /> {lesson.formats.join(' + ')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="self-end sm:self-center shrink-0">
                            {isComplete ? (
                              <button
                                type="button"
                                onClick={() => onOpenLesson(lesson.id)}
                                className="text-[13px] font-bold text-[#4A7FA7] hover:underline cursor-pointer"
                              >
                                Review Lesson ↗
                              </button>
                            ) : isSample ? (
                              <button
                                type="button"
                                onClick={() => onOpenLesson(lesson.id)}
                                className="
                                  inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                                  bg-[#0A1931] hover:bg-[#1A3D63] text-white text-[13px] font-bold
                                  shadow-[2px_2px_0px_#F4C84A] transition-all cursor-pointer min-h-[40px]
                                "
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Start Lesson</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onOpenLesson('inside-a-smartphone')}
                                className="text-[13px] font-bold text-[#64748B] hover:text-[#0A1931] cursor-pointer"
                              >
                                {isLocked ? 'Locked' : 'Open Lesson'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Practical Task Footer Card for this week */}
                  <div className="mt-4 pt-3.5 border-t border-[#D9E1E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF9F4] p-3.5 rounded-xl">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#FAF9F4] border border-[#0A1931] text-[#0A1931] flex items-center justify-center shrink-0 mt-0.5">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                          Practical Task · प्रत्यक्ष प्रात्यक्षिक
                        </span>
                        <h5 className="text-[14px] font-bold text-[#0A1931] font-sans">
                          {language === 'mr' ? week.task.titleMr : week.task.title}
                        </h5>
                      </div>
                    </div>

                    {week.weekNumber === 4 ? (
                      <button
                        type="button"
                        onClick={onOpenSkillProof}
                        className="
                          inline-flex items-center gap-1.5 text-[13px] font-bold text-white bg-[#0A1931] hover:bg-[#1A3D63]
                          px-3.5 py-1.5 rounded-lg shadow-[2px_2px_0px_#F4C84A] cursor-pointer self-end sm:self-auto
                        "
                      >
                        <Award className="w-3.5 h-3.5 text-[#F4C84A]" />
                        <span>Submit SkillProof ↗</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTaskModal(week.task)}
                        className="
                          inline-flex items-center gap-1 text-[13px] font-bold text-[#0A1931] hover:text-[#4A7FA7]
                          px-3 py-1.5 rounded-lg border border-[#D9E1E5] bg-[#FFFFFF] hover:bg-[#FAF9F4] cursor-pointer self-end sm:self-auto
                        "
                      >
                        {progress.completedTasks.includes(week.task.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#58B98C] stroke-[3]" />
                            <span>Practice Done ✓</span>
                          </>
                        ) : (
                          <>
                            <span>Start Task</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}

          </div>

          {/* RIGHT COLUMN / STICKY PANEL: PROGRESS, NEXT STEP, DOWNLOAD STATUS */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            
            {/* Primary Overall Progress Card */}
            <div className="p-5 rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931]">
              <div className="flex items-center justify-between text-xs font-bold text-[#0A1931] mb-2 font-mono">
                <span>{progress.overallProgress}% Complete</span>
                <span className="text-[#4A7FA7]">Week {progress.currentWeek} of 4</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-[#FAF9F4] border border-[#D9E1E5] overflow-hidden">
                <div
                  className="h-full bg-[#0A1931] rounded-full transition-all duration-300"
                  style={{ width: `${progress.overallProgress}%` }}
                />
              </div>

              <div className="mt-3 pt-3 border-t border-[#D9E1E5]/70 flex items-center justify-between text-xs text-[#64748B]">
                <span>{progress.completedLessons.length} of 16 lessons finished</span>
                <span className="font-bold text-[#0A1931]">~3 wks to go</span>
              </div>
            </div>

            {/* SkillProof Status Quick Card */}
            {(() => {
              const sp = getStoredSkillProof();
              return (
                <div className="p-4.5 rounded-[18px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#F4C84A]" />
                      <span className="text-[13px] font-bold text-[#0A1931]">
                        SkillProof Milestone
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sp.status === 'verified'
                        ? 'bg-[#58B98C]/20 text-[#2E7D32]'
                        : sp.status === 'mentor_pending'
                        ? 'bg-[#DCECF3] text-[#1A3D63]'
                        : sp.status === 'improvement_requested'
                        ? 'bg-[#F4C84A]/30 text-[#B86B00]'
                        : 'bg-[#FAF9F4] text-[#64748B] border border-[#D9E1E5]'
                    }`}>
                      {sp.status === 'verified'
                        ? '✓ Verified'
                        : sp.status === 'mentor_pending'
                        ? 'Under Review'
                        : sp.status === 'improvement_requested'
                        ? 'Needs Action'
                        : 'Unlocked'}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#64748B] leading-relaxed">
                    {sp.status === 'verified'
                      ? 'Your practical diagnosis badge is verified and active on your portfolio.'
                      : sp.status === 'mentor_pending'
                      ? 'AI preliminary check complete. Waiting for district mentor review.'
                      : 'Show practical ability via bench photo & audio explanation.'}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onOpenSkillProof}
                      className="text-[12px] font-bold text-[#4A7FA7] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{sp.status === 'verified' ? 'View Badge & Review' : 'Open SkillProof Project'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    {sp.status === 'verified' && onOpenProfileSkills && (
                      <button
                        type="button"
                        onClick={onOpenProfileSkills}
                        className="text-[11px] font-bold text-[#2E7D32] hover:underline cursor-pointer"
                      >
                        Portfolio ↗
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Reusable "Your Next Step" Card */}
            <NextStepCard
              badge={nextStep.badge}
              title={nextStep.title}
              description={nextStep.description}
              actionText={nextStep.actionText}
              onAction={nextStep.onAction}
            />

            {/* Offline Storage Card */}
            <div className="p-4.5 rounded-[18px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.04)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#4A7FA7]" />
                  <span className="text-[13px] font-bold text-[#0A1931]">
                    Offline Study Pack
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#58B98C] bg-[#58B98C]/15 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <p className="text-[12px] text-[#64748B] leading-relaxed">
                Week 1 audio & schematics cached on your smartphone. Study anytime without mobile data.
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onOpenDownloads}
                  className="text-[12px] font-bold text-[#4A7FA7] hover:underline cursor-pointer"
                >
                  Manage Downloads (~8 MB) ↗
                </button>
                <button
                  type="button"
                  onClick={handleDownloadWeek1}
                  className="text-[11px] text-[#64748B] hover:text-[#0A1931] cursor-pointer"
                >
                  Refresh cache
                </button>
              </div>
            </div>

            {/* Personalization Callout */}
            <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-[12px] text-[#17212B] leading-relaxed">
              <span className="font-bold text-[#0A1931] block mb-1">
                Personalized for Ravi Patil:
              </span>
              Your lessons emphasize listening and practice because that's how you told us you learn best.
            </div>

          </div>

        </div>

      </main>

      {/* Practical Task Modal */}
      {activeTaskModal && (
        <PracticalTaskModal
          task={activeTaskModal}
          isOpen={Boolean(activeTaskModal)}
          onClose={() => setActiveTaskModal(null)}
          onCompleteTask={handleTaskCompleted}
          language={language}
        />
      )}

      {/* Contextual Ask Kaushal Voice Modal */}
      <AskKaushalVoiceModal
        career={career}
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
      />

      {/* Online/Offline non-blocking sync notification */}
      <OfflineSyncToast />

      {/* Mobile Bottom Navigation (Learn Tab active) */}
      <BottomNavigation
        activeTab="learn"
        language={language}
        onTabChange={(tab: NavTab) => {
          if ((tab === 'home' || tab === 'discover') && (onBackToHome || onBackToPotential)) {
            (onBackToHome || onBackToPotential)!();
          } else if (tab === 'opportunities' || tab === 'earn') {
            if (onOpenOpportunities) onOpenOpportunities();
            else if (onOpenProfileSkills) onOpenProfileSkills();
          } else if (tab === 'profile' || tab === 'prove') {
            if (onOpenProfileSkills) onOpenProfileSkills();
            else onOpenSkillProof();
          }
        }}
      />
    </div>
  );
};
