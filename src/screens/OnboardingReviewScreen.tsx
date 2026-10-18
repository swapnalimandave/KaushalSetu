import React from 'react';
import { ArrowLeft, Check, Edit2, Sparkles, Smartphone, Wifi, Wrench, Compass, Calendar, MapPin, BookOpen, User } from 'lucide-react';
import { StudentProfile, LanguageCode } from '../types';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { AppHeader } from '../components/AppHeader';

interface OnboardingReviewScreenProps {
  profile: StudentProfile;
  language: LanguageCode;
  onEditStep: (stepNumber: number) => void;
  onConfirmAndFindPath: () => void;
  onLanguageChangeRequest: () => void;
}

export const OnboardingReviewScreen: React.FC<OnboardingReviewScreenProps> = ({
  profile,
  language,
  onEditStep,
  onConfirmAndFindPath,
  onLanguageChangeRequest,
}) => {
  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 w-full max-w-[840px] mx-auto px-4 sm:px-6 py-6 sm:py-9 flex flex-col">
        {/* Top Annotation */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <AnnotationTag variant="sticky" rotation={-1}>
            this helps us find realistic paths for you 🎯
          </AnnotationTag>
          <span className="text-xs font-semibold text-[#64748B]">
            Step 9 of 9 · Review
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            Does this look right?
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-1 font-devanagari">
            तुम्ही दिलेली माहिती तपासा. गरज असल्यास बदल करा.
          </p>
        </div>

        {/* Demo Learner Badge */}
        <div className="mb-5 p-3 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] flex items-center justify-between shadow-[1px_1px_0px_rgba(10,25,49,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center font-bold text-xs">
              RP
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#0A1931] block">
                {profile.name} (18 yrs)
              </span>
              <span className="text-[12px] text-[#64748B] block">
                {profile.state} · {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#58B98C] bg-[#58B98C]/15 px-2 py-0.5 rounded">
            Profile Ready
          </span>
        </div>

        {/* Review Cards Grid */}
        <div className="space-y-3.5 mb-8">
          
          {/* 1. Education */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DCECF3] text-[#1A3D63] flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  01 · Education
                </span>
                <p className="text-[16px] font-bold text-[#0A1931] mt-0.5">
                  {profile.education || 'Class 10'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 2. Interests */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F4C84A]/30 text-[#0A1931] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4.5 h-4.5 text-[#0A1931]" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  02 · Interested in
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {profile.interests.map((item) => (
                    <span
                      key={item}
                      className="text-[13px] font-bold text-[#0A1931] bg-[#FAF9F4] border border-[#D9E1E5] px-2.5 py-1 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 3. Existing Skills */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#58B98C]/20 text-[#17212B] flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  03 · Existing skills
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {profile.existingSkills.map((item) => (
                    <span
                      key={item}
                      className="text-[13px] font-bold text-[#0A1931] bg-[#FAF9F4] border border-[#D9E1E5] px-2.5 py-1 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                  {profile.customSkill && (
                    <span className="text-[13px] font-bold text-[#0A1931] bg-[#DCECF3] border border-[#4A7FA7]/40 px-2.5 py-1 rounded-md">
                      + {profile.customSkill}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 4. Work Preference */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EF6F61]/15 text-[#EF6F61] flex items-center justify-center shrink-0 mt-0.5">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  04 · Work preference
                </span>
                <p className="text-[16px] font-bold text-[#0A1931] mt-0.5">
                  {profile.workPreferences.join(', ') || 'Hands-on practical work'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 5. Earning Timeline */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DCECF3] text-[#1A3D63] flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  05 · Earning goal
                </span>
                <p className="text-[16px] font-bold text-[#0A1931] mt-0.5">
                  {profile.earningTimeline || 'Within 3 months'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 6. Travel */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  06 · Travel limit
                </span>
                <p className="text-[16px] font-bold text-[#0A1931] mt-0.5">
                  {profile.travelPreference || 'Nearby town'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(6)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 7. Device & Internet */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DCECF3] text-[#1A3D63] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  07 · Device & Internet
                </span>
                <p className="text-[16px] font-bold text-[#0A1931] mt-0.5">
                  {profile.deviceAccess || 'My own Android smartphone'}
                </p>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Internet: <span className="font-semibold text-[#0A1931]">{profile.internetAccess || 'Available sometimes'}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(7)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 8. Learning Style */}
          <div className="p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#58B98C]/20 text-[#17212B] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4.5 h-4.5 text-[#58B98C]" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                  08 · Learning style
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {profile.learningPreferences.map((item) => (
                    <span
                      key={item}
                      className="text-[13px] font-bold text-[#0A1931] bg-[#FAF9F4] border border-[#D9E1E5] px-2.5 py-1 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(8)}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] p-1.5 rounded-md hover:bg-[#FAF9F4] cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

        </div>

        {/* Bottom Confirmation Box */}
        <div className="p-5 sm:p-6 rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] font-sans">
            Everything looks good?
          </h2>
          <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
            आपली माहिती तपासून पुढे जाण्यासाठी खालील बटण दाबा.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <PrimaryButton
              fullWidth
              size="lg"
              onClick={onConfirmAndFindPath}
              icon={<Sparkles className="w-5 h-5 text-[#F4C84A]" />}
            >
              Find My Path
            </PrimaryButton>
            <SecondaryButton
              fullWidth
              size="md"
              onClick={() => onEditStep(1)}
            >
              Edit Answers
            </SecondaryButton>
          </div>
        </div>
      </main>
    </div>
  );
};
