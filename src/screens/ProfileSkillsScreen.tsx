import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  Calendar,
  Check,
  Eye,
  X,
  Camera,
  Mic,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode, SkillProofData } from '../types';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { VerifiedSkillBadge } from '../components/ui/VerifiedSkillBadge';
import { getStoredSkillProof } from '../utils/skillProofManager';

interface ProfileSkillsScreenProps {
  language: LanguageCode;
  onBackToEarnPath: () => void;
  onBackToHome?: () => void;
  onOpenOpportunities: () => void;
  onOpenSkillProofFlow: () => void;
  onOpenFacilitatorPortal?: () => void;
  onLanguageChangeRequest: () => void;
}

export const ProfileSkillsScreen: React.FC<ProfileSkillsScreenProps> = ({
  language,
  onBackToEarnPath,
  onBackToHome,
  onOpenOpportunities,
  onOpenSkillProofFlow,
  onOpenFacilitatorPortal,
  onLanguageChangeRequest,
}) => {
  const [skillProof, setSkillProof] = useState<SkillProofData>(getStoredSkillProof());
  const [selectedProofModal, setSelectedProofModal] = useState<SkillProofData | null>(null);

  const isVerified = skillProof.status === 'verified';

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-20">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      <main className="flex-1 w-full max-w-[880px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={onBackToEarnPath}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to EarnPath</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#64748B]">
            Portfolio ID: RAVI-9482
          </span>
        </div>

        {/* Profile Header */}
        <div className="p-6 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_#F4C84A]">
                RP
              </div>
              <div>
                <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] font-sans">
                  Ravi Patil · कौशल्य पोर्टफोलिओ
                </h1>
                <p className="text-[13px] text-[#64748B]">
                  Maharashtra · Mobile Device Repair Technician Trainee
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#58B98C]/20 border border-[#58B98C] text-[#0A1931]">
                {isVerified ? '1 Verified Skill' : 'SkillProof in Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: MY VERIFIED SKILLS */}
        <section aria-labelledby="verified-skills-title" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="verified-skills-title" className="text-[20px] sm:text-[22px] font-bold text-[#0A1931] font-sans">
                My Verified Skills · माझी सिद्ध झालेली कौशल्ये
              </h2>
              <p className="text-[13px] text-[#64748B] font-devanagari">
                Practical abilities verified by vocational mentors through project evidence.
              </p>
            </div>
            <AnnotationTag variant="sticky" rotation={-1}>
              mentor approved ✓
            </AnnotationTag>
          </div>

          {/* TAPED-PHOTO DISTINCTIVE PORTFOLIO CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 1: Basic Mobile Device Diagnosis */}
            <div
              className={`
                relative rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] p-5 sm:p-6
                shadow-[4px_4px_0px_#0A1931] transition-all hover:translate-y-[-2px]
                ${isVerified ? 'ring-1 ring-[#58B98C]' : ''}
              `}
            >
              {/* Taped top edge effect */}
              <div className="absolute -top-3.5 left-10 w-20 h-5 bg-[#F4C84A]/60 rotate-1 border-x border-[#0A1931]/15 pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#4A7FA7]">
                  SKILLPROOF 01
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isVerified ? 'bg-[#58B98C]/20 text-[#2E7D32]' : 'bg-[#DCECF3] text-[#1A3D63]'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isVerified ? 'Verified' : 'Pending Review'}
                </span>
              </div>

              {/* Photo preview thumbnail */}
              {skillProof.evidence.photoUrl && (
                <div className="rounded-xl overflow-hidden border-2 border-[#0A1931] mb-3.5 h-36 bg-[#FAF9F4]">
                  <img
                    src={skillProof.evidence.photoUrl}
                    alt="Multimeter diagnosis project"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="text-[18px] font-extrabold text-[#0A1931] font-sans leading-snug">
                {language === 'mr' ? skillProof.skillTitleMr : skillProof.skillTitle}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Path: {skillProof.pathwayTitle}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#D9E1E5] flex items-center justify-between text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" /> Photo + <Mic className="w-3.5 h-3.5" /> Voice
                </span>
                <span className="font-semibold text-[#0A1931]">
                  {skillProof.mentorReview?.reviewerName?.split(' ')[0] ? `Mentor Verified` : 'Submitted'}
                </span>
              </div>

              {/* View Evidence Button */}
              <div className="mt-4 pt-3 border-t border-[#D9E1E5]/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProofModal(skillProof)}
                  className="inline-flex items-center gap-1 text-[13px] font-bold text-[#4A7FA7] hover:text-[#0A1931] cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Evidence & Feedback</span>
                </button>

                <button
                  type="button"
                  disabled
                  title="Sharing feature coming in Phase 5"
                  className="text-xs text-[#64748B] opacity-50 cursor-not-allowed flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share (Later)</span>
                </button>
              </div>
            </div>

            {/* Upcoming Skill Slot 02 */}
            <div className="rounded-[22px] bg-[#FAF9F4] border-2 border-dashed border-[#D9E1E5] p-6 flex flex-col items-center justify-center text-center">
              <Award className="w-10 h-10 text-[#64748B] opacity-40 mb-2" />
              <span className="text-[11px] font-mono font-bold uppercase text-[#64748B]">
                SKILLPROOF 02 · NEXT
              </span>
              <h4 className="text-[16px] font-bold text-[#0A1931] mt-1">
                Display & Glass Replacement
              </h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-xs">
                Unlocks in advanced repair module after local shop practice.
              </p>
            </div>

          </div>
        </section>

        {/* Opportunity Matcher Banner */}
        {isVerified && (
          <div className="p-6 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#58B98C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#58B98C]">
                Ready for Opportunities
              </span>
              <h3 className="text-[18px] font-bold text-[#0A1931] mt-0.5">
                Your verified skill matches local apprenticeships
              </h3>
              <p className="text-[13px] text-[#64748B]">
                Explore verified district repair shops and technician assistant roles.
              </p>
            </div>

            <PrimaryButton size="md" onClick={onOpenOpportunities}>
              Explore Opportunities ↗
            </PrimaryButton>
          </div>
        )}

      </main>

      {/* DETAIL MODAL: VIEW EVIDENCE & MENTOR RUBRIC */}
      {selectedProofModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1931]/60 backdrop-blur-xs"
        >
          <div className="absolute inset-0" onClick={() => setSelectedProofModal(null)} aria-hidden="true" />

          <div className="relative w-full max-w-lg bg-[#FAF9F4] rounded-[22px] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 z-10 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4A7FA7]">
                SkillProof Verified Record
              </span>
              <button
                type="button"
                onClick={() => setSelectedProofModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-[20px] font-extrabold text-[#0A1931]">
                {selectedProofModal.skillTitle}
              </h3>
              <p className="text-xs text-[#64748B]">
                Project: {selectedProofModal.projectTitle} · Verified on {selectedProofModal.verifiedAt || 'Today'}
              </p>
            </div>

            {/* Evidence Preview */}
            <div className="my-4 space-y-3">
              {selectedProofModal.evidence.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-[#0A1931] max-h-48 bg-white">
                  <img
                    src={selectedProofModal.evidence.photoUrl}
                    alt="Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedProofModal.evidence.audioTranscript && (
                <div className="p-3 rounded-lg bg-white border border-[#D9E1E5] text-xs">
                  <span className="font-bold text-[#0A1931] block mb-1">Voice Transcript:</span>
                  <p className="text-[#17212B] italic">“{selectedProofModal.evidence.audioTranscript}”</p>
                </div>
              )}

              {selectedProofModal.mentorReview && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#58B98C] text-xs">
                  <span className="font-bold text-[#2E7D32] block mb-1">
                    Mentor Feedback ({selectedProofModal.mentorReview.reviewerName}):
                  </span>
                  <p className="text-[#0A1931]">“{selectedProofModal.mentorReview.feedbackNote}”</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#D9E1E5] flex justify-end">
              <SecondaryButton size="md" fullWidth onClick={() => setSelectedProofModal(null)}>
                Close Record
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="profile"
        language={language}
        onTabChange={(tab) => {
          if (tab === 'home' || tab === 'discover') {
            if (onBackToHome) onBackToHome();
            else onBackToEarnPath();
          } else if (tab === 'learn') {
            onBackToEarnPath();
          } else if (tab === 'opportunities' || tab === 'earn') {
            onOpenOpportunities();
          }
        }}
      />
    </div>
  );
};
