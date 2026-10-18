import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  BookOpen,
  Award,
  Briefcase,
  FileCheck,
  Flag,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  LanguageCode,
  StudentProfile,
  CareerOption,
  LearningProgress,
  SkillProofData,
  ApplicationPreparation,
  LivelihoodStage,
  LivelihoodOutcomeStatus,
} from '../types';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import {
  getStoredOutcome,
  saveStoredOutcome,
  calculateJourneyStages,
  getOutcomeLabel,
  getOutcomeLabelMr,
} from '../utils/journeyManager';

interface LivelihoodJourneyScreenProps {
  language: LanguageCode;
  profile: StudentProfile;
  career: CareerOption | null;
  progress: LearningProgress;
  skillProof: SkillProofData;
  application: ApplicationPreparation;
  onBackToHome: () => void;
  onNavigateToScreen: (screen: string) => void;
  onOpenFacilitatorPortal?: () => void;
  onLanguageChangeRequest: () => void;
}

export const LivelihoodJourneyScreen: React.FC<LivelihoodJourneyScreenProps> = ({
  language,
  profile,
  career,
  progress,
  skillProof,
  application,
  onBackToHome,
  onNavigateToScreen,
  onOpenFacilitatorPortal,
  onLanguageChangeRequest,
}) => {
  const [outcome, setOutcome] = useState(getStoredOutcome());
  const [isEditingOutcome, setIsEditingOutcome] = useState(false);
  const [selectedOutcomeStatus, setSelectedOutcomeStatus] = useState<LivelihoodOutcomeStatus>(outcome.status);
  const [outcomeNote, setOutcomeNote] = useState(outcome.notes || '');

  const stages = calculateJourneyStages(career, progress, skillProof, application, outcome);

  const handleSaveOutcome = () => {
    const updated = {
      status: selectedOutcomeStatus,
      updatedAt: new Date().toISOString().split('T')[0],
      notes: outcomeNote,
    };
    saveStoredOutcome(updated);
    setOutcome(updated);
    setIsEditingOutcome(false);
  };

  const getStageIcon = (id: string) => {
    switch (id) {
      case 'discover':
        return Compass;
      case 'learn':
        return BookOpen;
      case 'prove':
        return Award;
      case 'match':
        return Briefcase;
      case 'apply':
        return FileCheck;
      case 'outcome':
      default:
        return Flag;
    }
  };

  const outcomeOptions: { value: LivelihoodOutcomeStatus; label: string; labelMr: string }[] = [
    { value: 'no_outcome_yet', label: 'No Outcome Yet (Exploring)', labelMr: 'अजून कोणताही निकाल नाही (शिकत आहे)' },
    { value: 'applied', label: 'Application Submitted', labelMr: 'अर्ज सादर केला आहे' },
    { value: 'interview_scheduled', label: 'Shop Visit / Greeting Scheduled', labelMr: 'दुकानात भेट / चर्चा निश्चित झाली' },
    { value: 'apprenticeship_offered', label: 'Apprenticeship Offered (शिकाऊ उमेदवारी)', labelMr: 'शिकाऊ उमेदवारी मिळाली' },
    { value: 'job_offered', label: 'Full-time / Bench Tech Job Offered', labelMr: 'नोकरीची ऑफर मिळाली' },
    { value: 'training_joined', label: 'Govt ITI / Skill Center Joined', labelMr: 'सरकारी प्रशिक्षण केंद्रात प्रवेश घेतला' },
    { value: 'self_employment_started', label: 'Independent Repair Work Started', labelMr: 'स्वतःचे दुरुस्ती काम सुरू केले' },
  ];

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-24">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      <main className="flex-1 w-full max-w-[840px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'mr' ? 'मुख्य पृष्ठावर परत' : 'Back to Home'}</span>
          </button>

          <span className="text-[12px] font-mono text-[#64748B]">
            Student: {profile.name}
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 sm:p-8 mb-8">
          <div className="absolute -top-3.5 right-6">
            <AnnotationTag variant="sticky" rotation={-1}>
              {language === 'mr' ? '६ पायऱ्यांचा प्रवास 🛤️' : '6-Stage Philosophy 🛤️'}
            </AnnotationTag>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7] block mb-1">
            {language === 'mr' ? 'कौशलसेतू तत्त्वज्ञान' : 'KaushalSetu Journey'}
          </span>
          <h1 className="text-[24px] sm:text-[30px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            {language === 'mr' ? 'उपजीविकेचा मार्गदर्शक ट्रॅकर' : 'Livelihood Journey Tracker'}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-2 leading-relaxed">
            {language === 'mr'
              ? 'आवड शोधणे → व्यावहारिक शिकणे → कौशल्य सिद्ध करणे → स्थानिक संधी जुळणी → अर्जाची तयारी → उपजीविका परिणाम. कोणतीही खोटी रोजगार आश्वासने नाहीत.'
              : 'Discover → Learn → Prove → Match → Apply → Real Outcome. We provide clear step-by-step progress without fabricated placement scores.'}
          </p>

          <div className="mt-4 pt-3.5 border-t border-[#D9E1E5] flex flex-wrap items-center gap-4 text-xs font-medium text-[#1A3D63]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E6B52]" />
              {language === 'mr' ? 'पूर्ण झालेले' : 'Completed'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A7FA7]" />
              {language === 'mr' ? 'सध्या सुरू असलेले' : 'In Progress'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
              {language === 'mr' ? 'पुढील टप्पे' : 'Upcoming'}
            </span>
          </div>
        </div>

        {/* Vertical Stages List */}
        <div className="space-y-4">
          {stages.map((stage) => {
            const Icon = getStageIcon(stage.id);
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <div
                key={stage.id}
                className={`
                  rounded-[18px] bg-[#FFFFFF] border-2 transition-all p-5 sm:p-6
                  ${
                    isCurrent
                      ? 'border-[#0A1931] shadow-[4px_4px_0px_#0A1931]'
                      : isCompleted
                      ? 'border-[#1E6B52]/50 shadow-[2px_2px_0px_#1E6B52]'
                      : 'border-[#D9E1E5] opacity-80'
                  }
                `}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Badge / Status Circle */}
                    <div
                      className={`
                        w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5
                        ${
                          isCompleted
                            ? 'bg-[#E8F5E9] text-[#1E6B52] border border-[#1E6B52]/30'
                            : isCurrent
                            ? 'bg-[#DCECF3] text-[#0A1931] border-2 border-[#0A1931]'
                            : 'bg-[#FAF9F4] text-[#94A3B8] border border-[#D9E1E5]'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-[#64748B]">
                          STAGE 0{stage.order}
                        </span>
                        <span
                          className={`
                            text-[11px] font-bold px-2 py-0.5 rounded-full
                            ${
                              isCompleted
                                ? 'bg-[#E8F5E9] text-[#1E6B52]'
                                : isCurrent
                                ? 'bg-[#DCECF3] text-[#0A1931]'
                                : 'bg-[#FAF9F4] text-[#64748B] border border-[#D9E1E5]'
                            }
                          `}
                        >
                          {isCompleted ? 'Completed' : isCurrent ? 'Active Now' : 'Upcoming'}
                        </span>
                      </div>

                      <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#0A1931] font-sans">
                        {language === 'mr' ? stage.labelMr : stage.label}
                      </h2>

                      <p className="text-[14px] font-bold text-[#1A3D63] mt-1 font-devanagari">
                        {language === 'mr' ? stage.summaryMr : stage.summary}
                      </p>

                      {stage.highlightDetail && (
                        <p className="text-[12px] text-[#64748B] mt-1">
                          {stage.highlightDetail}
                        </p>
                      )}

                      {/* Stage 6 Self-Reported Outcome Action */}
                      {stage.id === 'outcome' && (
                        <div className="mt-4 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                              Self-Reported Status
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingOutcome(true)}
                              className="text-xs font-bold text-[#4A7FA7] hover:underline cursor-pointer"
                            >
                              Update Status
                            </button>
                          </div>
                          <p className="text-[14px] font-extrabold text-[#0A1931]">
                            {language === 'mr' ? getOutcomeLabelMr(outcome.status) : getOutcomeLabel(outcome.status)}
                          </p>
                          {outcome.notes && (
                            <p className="text-xs text-[#64748B] mt-1 italic">
                              "{outcome.notes}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage Action Button */}
                  <div className="sm:self-center shrink-0">
                    {stage.id !== 'outcome' ? (
                      <button
                        type="button"
                        onClick={() => onNavigateToScreen(stage.routeTarget)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold bg-[#FAF9F4] hover:bg-[#DCECF3] border border-[#0A1931] text-[#0A1931] transition-colors cursor-pointer"
                      >
                        <span>
                          {stage.id === 'discover'
                            ? 'Review Pathway'
                            : stage.id === 'learn'
                            ? 'Go to EarnPath'
                            : stage.id === 'prove'
                            ? 'View SkillProof'
                            : stage.id === 'match'
                            ? 'View Matches'
                            : 'View Checklist'}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingOutcome(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold bg-[#DCECF3] hover:bg-[#B9D9EB] border border-[#0A1931] text-[#0A1931] transition-colors cursor-pointer"
                      >
                        <span>Update Outcome</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Update Self-Reported Outcome */}
        {isEditingOutcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1931]/60 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[6px_6px_0px_#0A1931] rounded-[22px] max-w-lg w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7] block mb-1">
                Livelihood Outcome Record
              </span>
              <h3 className="text-[20px] font-extrabold text-[#0A1931] font-sans mb-2">
                Report Your Real-World Progress
              </h3>
              <p className="text-[13px] text-[#64748B] mb-4 leading-relaxed">
                KaushalSetu never claims or invents placement data. Please select your current real status:
              </p>

              <div className="space-y-2 mb-4">
                {outcomeOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        selectedOutcomeStatus === opt.value
                          ? 'border-[#0A1931] bg-[#DCECF3]/40'
                          : 'border-[#D9E1E5] hover:border-[#4A7FA7]'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="outcomeStatus"
                      value={opt.value}
                      checked={selectedOutcomeStatus === opt.value}
                      onChange={() => setSelectedOutcomeStatus(opt.value)}
                      className="w-4 h-4 text-[#4A7FA7] accent-[#0A1931]"
                    />
                    <div>
                      <span className="text-[13px] font-bold text-[#0A1931] block">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {opt.labelMr}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mb-5">
                <label className="text-xs font-bold text-[#1A3D63] block mb-1">
                  Optional note (e.g., Shop name or joining date):
                </label>
                <input
                  type="text"
                  value={outcomeNote}
                  onChange={(e) => setOutcomeNote(e.target.value)}
                  placeholder="e.g. Visited Suresh's shop on Tuesday"
                  className="w-full px-3.5 py-2 text-[13px] rounded-xl border border-[#0A1931] bg-[#FAF9F4] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7]"
                />
              </div>

              <div className="flex gap-3">
                <SecondaryButton fullWidth size="md" onClick={() => setIsEditingOutcome(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton fullWidth size="md" onClick={handleSaveOutcome}>
                  Save Progress
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation
        activeTab="home"
        language={language}
        onTabChange={(tab) => {
          if (tab === 'home') onBackToHome();
          if (tab === 'learn') onNavigateToScreen('earnpath');
          if (tab === 'opportunities') onNavigateToScreen('opportunities_placeholder');
          if (tab === 'profile') onNavigateToScreen('profile_skills');
        }}
      />
    </div>
  );
};
