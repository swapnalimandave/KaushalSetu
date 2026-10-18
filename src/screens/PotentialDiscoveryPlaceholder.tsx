import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Award, Briefcase, RefreshCw, Compass } from 'lucide-react';
import { StudentProfile, LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

interface PotentialDiscoveryPlaceholderProps {
  profile: StudentProfile;
  language: LanguageCode;
  onEditProfile: () => void;
  onRestart: () => void;
  onLanguageChangeRequest: () => void;
}

export const PotentialDiscoveryPlaceholder: React.FC<PotentialDiscoveryPlaceholderProps> = ({
  profile,
  language,
  onEditProfile,
  onRestart,
  onLanguageChangeRequest,
}) => {
  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col">
        {/* Navigation & Status */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] cursor-pointer min-h-[44px] px-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Review Profile Answers</span>
          </button>

          <AnnotationTag variant="sticky" rotation={1}>
            Discovery Complete ✓
          </AnnotationTag>
        </div>

        {/* Main Card */}
        <div className="relative rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Step 02 Complete · Next: AI Potential Profile
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            Potential Discovery Results
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-2 font-devanagari leading-relaxed">
            अभिनंदन, <span className="font-bold text-[#0A1931]">{profile.name}</span>! तुमची आवड, परिस्थिती आणि कौशल्ये सुरक्षित जतन केली गेली आहेत.
          </p>

          <div className="my-6 p-4.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#F4C84A]" />
              <span className="text-[13px] font-bold uppercase tracking-wider text-[#0A1931]">
                Profile Highlights Synthesized:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5]/70">
                <span className="text-[11px] font-bold uppercase text-[#64748B] block">Education & Baseline</span>
                <span className="font-bold text-[#0A1931]">{profile.education}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5]/70">
                <span className="text-[11px] font-bold uppercase text-[#64748B] block">Earning Urgency</span>
                <span className="font-bold text-[#0A1931]">{profile.earningTimeline}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5]/70">
                <span className="text-[11px] font-bold uppercase text-[#64748B] block">Primary Interest Area</span>
                <span className="font-bold text-[#0A1931]">{profile.interests.slice(0, 2).join(', ')}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5]/70">
                <span className="text-[11px] font-bold uppercase text-[#64748B] block">Travel & Location Reach</span>
                <span className="font-bold text-[#0A1931]">{profile.travelPreference}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#DCECF3]/60 border border-[#4A7FA7]/30 text-[13px] text-[#1A3D63] leading-relaxed mb-6">
            <span className="font-bold">Next Prompt Scope:</span> In the following step, we will generate the actual AI Potential Profile and career recommendation modules (personalized 4-week EarnPath, verified apprenticeships, and SkillProof badges).
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#D9E1E5]">
            <SecondaryButton fullWidth size="md" onClick={onEditProfile}>
              Edit Onboarding Answers
            </SecondaryButton>
            <SecondaryButton fullWidth size="md" onClick={onRestart} icon={<RefreshCw className="w-4 h-4" />}>
              Start Over (Reset Demo)
            </SecondaryButton>
          </div>
        </div>
      </main>
    </div>
  );
};
