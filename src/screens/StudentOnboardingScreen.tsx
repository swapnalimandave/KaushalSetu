import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mic, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { StudentProfile, LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { QuestionCard } from '../components/ui/QuestionCard';
import { OfflineBadge } from '../components/ui/OfflineBadge';
import { WhyAskExplanation } from '../components/ui/WhyAskExplanation';
import { VoiceAnswerModal } from '../components/VoiceAnswerModal';
import {
  EDUCATION_OPTIONS,
  INTEREST_OPTIONS,
  EXISTING_SKILL_OPTIONS,
  WORK_PREFERENCE_OPTIONS,
  EARNING_TIMELINE_OPTIONS,
  TRAVEL_OPTIONS,
  DEVICE_OPTIONS,
  INTERNET_OPTIONS,
  LEARNING_PREFERENCE_OPTIONS,
} from '../data/onboardingQuestions';

interface StudentOnboardingScreenProps {
  profile: StudentProfile;
  language: LanguageCode;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onFinishOnboarding: () => void;
  onExitToWelcome: () => void;
  onLanguageChangeRequest: () => void;
  initialStep?: number;
}

export const StudentOnboardingScreen: React.FC<StudentOnboardingScreenProps> = ({
  profile,
  language,
  onUpdateProfile,
  onFinishOnboarding,
  onExitToWelcome,
  onLanguageChangeRequest,
  initialStep = 1,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState(profile.customSkill || '');
  const [showCustomSkillField, setShowCustomSkillField] = useState(Boolean(profile.customSkill));
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const totalSteps = 8;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Toggle helper for multi-select arrays
  const handleToggleMulti = (field: 'interests' | 'existingSkills' | 'learningPreferences', value: string) => {
    setValidationWarning(null);
    const currentList = profile[field] || [];
    if (currentList.includes(value)) {
      onUpdateProfile({ [field]: currentList.filter((item) => item !== value) });
    } else {
      onUpdateProfile({ [field]: [...currentList, value] });
    }
  };

  // Toggle helper for Work Preferences (limit to 2)
  const handleToggleWorkPref = (value: string) => {
    setValidationWarning(null);
    const currentList = profile.workPreferences || [];
    if (currentList.includes(value)) {
      onUpdateProfile({ workPreferences: currentList.filter((item) => item !== value) });
    } else {
      if (currentList.length >= 2) {
        // Replace oldest or cap at 2
        onUpdateProfile({ workPreferences: [currentList[1], value] });
      } else {
        onUpdateProfile({ workPreferences: [...currentList, value] });
      }
    }
  };

  // Voice Answer apply handler
  const handleApplyVoiceAnswer = (matchedOptions: string[], rawTranscript: string) => {
    if (matchedOptions.length === 0) return;

    switch (currentStep) {
      case 1:
        onUpdateProfile({ education: matchedOptions[0] });
        break;
      case 2:
        onUpdateProfile({
          interests: Array.from(new Set([...profile.interests, ...matchedOptions])),
        });
        break;
      case 3:
        onUpdateProfile({
          existingSkills: Array.from(new Set([...profile.existingSkills, ...matchedOptions])),
        });
        break;
      case 4:
        onUpdateProfile({
          workPreferences: matchedOptions.slice(0, 2),
        });
        break;
      case 5:
        onUpdateProfile({ earningTimeline: matchedOptions[0] });
        break;
      case 6:
        onUpdateProfile({ travelPreference: matchedOptions[0] });
        break;
      case 7:
        if (matchedOptions.some((opt) => DEVICE_OPTIONS.some((d) => d.id === opt))) {
          const dev = matchedOptions.find((opt) => DEVICE_OPTIONS.some((d) => d.id === opt));
          if (dev) onUpdateProfile({ deviceAccess: dev });
        }
        if (matchedOptions.some((opt) => INTERNET_OPTIONS.some((i) => i.id === opt))) {
          const net = matchedOptions.find((opt) => INTERNET_OPTIONS.some((i) => i.id === opt));
          if (net) onUpdateProfile({ internetAccess: net });
        }
        break;
      case 8:
        onUpdateProfile({
          learningPreferences: Array.from(new Set([...profile.learningPreferences, ...matchedOptions])),
        });
        break;
    }
  };

  // Step progression validation & handler
  const handleNext = () => {
    setValidationWarning(null);

    // Light verification for required answer
    if (currentStep === 1 && !profile.education) {
      setValidationWarning('Please select your education to continue.');
      return;
    }
    if (currentStep === 2 && profile.interests.length === 0) {
      setValidationWarning('Please choose at least one thing you enjoy.');
      return;
    }
    if (currentStep === 4 && profile.workPreferences.length === 0) {
      setValidationWarning('Please select a preferred type of work.');
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Save optional custom skill before reviewing
      if (customSkillInput.trim()) {
        onUpdateProfile({ customSkill: customSkillInput.trim() });
      }
      onFinishOnboarding();
    }
  };

  const handleBack = () => {
    setValidationWarning(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onExitToWelcome();
    }
  };

  // Title for voice assistant
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Education';
      case 2: return 'Interests';
      case 3: return 'Existing Skills';
      case 4: return 'Work Preference';
      case 5: return 'Earning Goal';
      case 6: return 'Travel Reach';
      case 7: return 'Device & Internet';
      case 8: return 'Learning Style';
      default: return 'Onboarding';
    }
  };

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      {/* Lightweight Onboarding Header */}
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      {/* Main Form Container: One Question Per Step */}
      <main className="flex-1 w-full max-w-[780px] mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col">
        
        {/* Supportive Conversation Lead & Note */}
        <div className="mb-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h1 className="text-[17px] sm:text-[19px] font-bold text-[#0A1931]">
              Let’s understand you better
            </h1>
            <span className="font-handwriting text-[14px] text-[#4A7FA7] font-bold">
              no right or wrong answers ✍️
            </span>
          </div>
          <p className="text-[13px] sm:text-[14px] text-[#64748B] mt-0.5">
            This will help us suggest practical paths that fit your interests, situation and goals.
          </p>
        </div>

        {/* Progress System: "Step X of 8" with solid horizontal fill bar */}
        <div className="mb-6 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.03)]">
          <div className="flex items-center justify-between text-xs font-bold text-[#0A1931] mb-2 font-mono">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-[#4A7FA7]">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#FAF9F4] border border-[#D9E1E5] overflow-hidden">
            <div
              className="h-full bg-[#0A1931] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Question Card Box */}
        <div className="relative rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-7 transition-all">
          
          {/* Top Bar with Voice Action on EVERY question */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D9E1E5]/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Question 0{currentStep}
            </span>

            {/* Answer by voice button */}
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-[#FAF9F4] hover:bg-[#DCECF3] border border-[#0A1931] text-[13px] font-bold text-[#0A1931]
                shadow-[2px_2px_0px_#EF6F61] hover:shadow-[1px_1px_0px_#EF6F61]
                transition-all duration-150 cursor-pointer min-h-[38px] select-none
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7FA7]
              "
              aria-label="Answer by voice"
            >
              <Mic className="w-3.5 h-3.5 text-[#EF6F61]" />
              <span>Answer by voice</span>
            </button>
          </div>

          {/* Validation warning if step is skipped without selection */}
          {validationWarning && (
            <div className="mb-4 p-3 rounded-xl bg-[#FAF9F4] border border-[#EF6F61] flex items-center gap-2 text-[13px] text-[#C62828]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationWarning}</span>
            </div>
          )}

          {/* QUESTION 1 — EDUCATION */}
          {currentStep === 1 && (
            <section aria-labelledby="q1-title">
              <h2 id="q1-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                What have you studied?
              </h2>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                Choose the option closest to your current education. · तुमचे शिक्षण किती झाले आहे?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {EDUCATION_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isSelected={profile.education === opt.id}
                    language={language}
                    onClick={() => {
                      setValidationWarning(null);
                      onUpdateProfile({ education: opt.id });
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* QUESTION 2 — INTERESTS */}
          {currentStep === 2 && (
            <section aria-labelledby="q2-title">
              <h2 id="q2-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                What kinds of things do you enjoy doing?
              </h2>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                Choose as many as you like. · तुम्हाला कोणत्या गोष्टी करायला आवडतात?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {INTEREST_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isMultiSelect={true}
                    isSelected={profile.interests.includes(opt.id)}
                    language={language}
                    onClick={() => handleToggleMulti('interests', opt.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* QUESTION 3 — EXISTING SKILLS */}
          {currentStep === 3 && (
            <section aria-labelledby="q3-title">
              <h2 id="q3-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                What can you already do?
              </h2>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                Even small skills count. · लहान कौशल्येही महत्त्वाची आहेत.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {EXISTING_SKILL_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isMultiSelect={true}
                    isSelected={profile.existingSkills.includes(opt.id)}
                    language={language}
                    onClick={() => handleToggleMulti('existingSkills', opt.id)}
                  />
                ))}
              </div>

              {/* Optional Something Else */}
              <div className="mt-4 pt-3 border-t border-[#D9E1E5]">
                {!showCustomSkillField ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomSkillField(true)}
                    className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Something else? / इतर काही येते का?</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <label htmlFor="custom-skill" className="block text-xs font-bold uppercase text-[#0A1931]">
                      Add other skill or knowledge:
                    </label>
                    <input
                      id="custom-skill"
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => {
                        setCustomSkillInput(e.target.value);
                        onUpdateProfile({ customSkill: e.target.value });
                      }}
                      placeholder="e.g. driving tractor, mobile photo editing, etc."
                      className="w-full p-3 rounded-[12px] bg-[#FFFFFF] border border-[#D9E1E5] text-[15px] text-[#0A1931] focus:outline-none focus:border-[#0A1931]"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* QUESTION 4 — WORK PREFERENCE */}
          {currentStep === 4 && (
            <section aria-labelledby="q4-title">
              <div className="flex items-center justify-between">
                <h2 id="q4-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                  What kind of work would suit you?
                </h2>
              </div>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                Choose up to 2 options. · तुम्हाला कोणत्या प्रकारचे काम आवडेल? (जास्तीत जास्त २)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {WORK_PREFERENCE_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isMultiSelect={true}
                    isSelected={profile.workPreferences.includes(opt.id)}
                    language={language}
                    onClick={() => handleToggleWorkPref(opt.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* QUESTION 5 — EARNING GOAL */}
          {currentStep === 5 && (
            <section aria-labelledby="q5-title">
              <h2 id="q5-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                How soon would you like to start earning?
              </h2>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                We use this to avoid suggesting paths that take longer than you can realistically wait.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {EARNING_TIMELINE_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isSelected={profile.earningTimeline === opt.id}
                    language={language}
                    onClick={() => {
                      setValidationWarning(null);
                      onUpdateProfile({ earningTimeline: opt.id });
                    }}
                  />
                ))}
              </div>

              <WhyAskExplanation
                explanation="We use this to avoid recommending long multi-year degrees if you or your family need income within a few months."
                explanationMr="जर तुम्हाला तातडीने उत्पन्नाची गरज असेल तर खूप जास्त काळ चालणारे अभ्यासक्रम सुचवणे टाळण्यासाठी हे विचारत आहोत."
                explanationHi="अगर आपको जल्द कमाई की ज़रूरत है, तो हम ऐसे कोर्स नहीं सुझाएँगे जिनमें बहुत साल लगते हैं।"
                language={language}
              />
            </section>
          )}

          {/* QUESTION 6 — TRAVEL */}
          {currentStep === 6 && (
            <section aria-labelledby="q6-title">
              <h2 id="q6-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                How far can you travel for learning or work?
              </h2>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                शिकण्यासाठी किंवा कामासाठी तुम्ही किती अंतर जाऊ शकता?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {TRAVEL_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isSelected={profile.travelPreference === opt.id}
                    language={language}
                    onClick={() => {
                      setValidationWarning(null);
                      onUpdateProfile({ travelPreference: opt.id });
                    }}
                  />
                ))}
              </div>

              <WhyAskExplanation
                explanation="Travel costs, buses, and daily commutes are major constraints in rural areas. We focus on training centers and apprenticeships you can realistically reach."
                explanationMr="ग्रामीण भागात प्रवासाचा खर्च आणि एसटी बसची सोय महत्त्वाची असते. तुम्ही पोहचू शकाल अशीच केंद्रे आम्ही शोधतो."
                explanationHi="गाँवों में आने-जाने का खर्च और साधन सीमित होते हैं। हम वही अवसर सुझाएँगे जहाँ आप आसानी से पहुँच सकें।"
                language={language}
              />
            </section>
          )}

          {/* QUESTION 7 — DEVICE + INTERNET */}
          {currentStep === 7 && (
            <section aria-labelledby="q7-title" className="space-y-6">
              <div>
                <h2 id="q7-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                  What access do you have?
                </h2>
                <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                  तुमच्याकडे मोबाईल आणि इंटरनेटची काय सोय आहे?
                </p>
              </div>

              {/* Section 1: Device */}
              <div>
                <h3 className="text-[15px] font-bold text-[#0A1931] mb-2 font-sans flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#FAF9F4] border border-[#0A1931] text-[11px] font-bold text-[#0A1931] flex items-center justify-center font-mono">
                    A
                  </span>
                  <span>Device / साधन</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEVICE_OPTIONS.map((opt) => (
                    <QuestionCard
                      key={opt.id}
                      id={opt.id}
                      label={opt.label}
                      labelMr={opt.labelMr}
                      labelHi={opt.labelHi}
                      iconName={opt.iconName}
                      isSelected={profile.deviceAccess === opt.id}
                      language={language}
                      onClick={() => onUpdateProfile({ deviceAccess: opt.id })}
                    />
                  ))}
                </div>
              </div>

              {/* Section 2: Internet */}
              <div className="pt-2 border-t border-[#D9E1E5]/70">
                <h3 className="text-[15px] font-bold text-[#0A1931] mb-2 font-sans flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#FAF9F4] border border-[#0A1931] text-[11px] font-bold text-[#0A1931] flex items-center justify-center font-mono">
                    B
                  </span>
                  <span>Internet / नेटवर्क स्थिती</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INTERNET_OPTIONS.map((opt) => (
                    <QuestionCard
                      key={opt.id}
                      id={opt.id}
                      label={opt.label}
                      labelMr={opt.labelMr}
                      labelHi={opt.labelHi}
                      iconName={opt.iconName}
                      isSelected={profile.internetAccess === opt.id}
                      language={language}
                      onClick={() => onUpdateProfile({ internetAccess: opt.id })}
                    />
                  ))}
                </div>
              </div>

              {/* Offline note */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex items-start gap-2.5">
                <OfflineBadge label="Offline Ready" />
                <p className="text-[13px] text-[#17212B] leading-snug">
                  KaushalSetu can recommend downloadable lessons when internet access is limited.
                </p>
              </div>

              <WhyAskExplanation
                explanation="We ask so we don't suggest heavy video courses that consume all your mobile recharge. We provide lightweight text, audio, and offline downloads."
                explanationMr="तुमचा मोबाईल डेटा वाया जाऊ नये म्हणून आम्ही ऑडिओ व डाऊनलोड करता येणारे धडे प्राधान्याने देतो."
                explanationHi="हम आपके डेटा और फोन के अनुसार हल्के और ऑफलाइन डाउनलोड होने वाले पाठ तैयार करते हैं।"
                language={language}
              />
            </section>
          )}

          {/* QUESTION 8 — LEARNING STYLE */}
          {currentStep === 8 && (
            <section aria-labelledby="q8-title">
              <h2 id="q8-title" className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] tracking-tight font-sans">
                How do you learn best?
              </h2>
              <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
                Choose the ways you grasp things easily. · तुम्हाला कसे शिकायला सोपे वाटते?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                {LEARNING_PREFERENCE_OPTIONS.map((opt) => (
                  <QuestionCard
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    labelMr={opt.labelMr}
                    labelHi={opt.labelHi}
                    iconName={opt.iconName}
                    isMultiSelect={true}
                    isSelected={profile.learningPreferences.includes(opt.id)}
                    language={language}
                    onClick={() => handleToggleMulti('learningPreferences', opt.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Navigation Controls: Back and Continue/Next */}
          <div className="mt-8 pt-5 border-t border-[#D9E1E5] flex items-center justify-between gap-3">
            <SecondaryButton
              size="md"
              onClick={handleBack}
              icon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}
            >
              Back
            </SecondaryButton>

            <PrimaryButton
              size="md"
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              iconPosition="right"
            >
              {currentStep === totalSteps ? 'Review Answers' : 'Continue'}
            </PrimaryButton>
          </div>

        </div>

      </main>

      {/* Voice Answer Bottom Sheet Modal */}
      <VoiceAnswerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        stepNumber={currentStep}
        questionTitle={getStepTitle()}
        language={language}
        onApplyVoiceAnswer={handleApplyVoiceAnswer}
      />
    </div>
  );
};
