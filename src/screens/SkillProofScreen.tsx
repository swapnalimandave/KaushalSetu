import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  Upload,
  Mic,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Trash2,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Eye,
  Award,
  ChevronRight,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { LanguageCode, SkillProofData, EvidenceData } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { NextStepCard } from '../components/ui/NextStepCard';
import { VerifiedSkillBadge } from '../components/ui/VerifiedSkillBadge';
import {
  getStoredSkillProof,
  updateSkillProofEvidence,
  submitSkillProof,
  SAMPLE_PROJECT_PHOTO,
  SAMPLE_VOICE_TRANSCRIPT,
} from '../utils/skillProofManager';

interface SkillProofScreenProps {
  language: LanguageCode;
  onBackToEarnPath: () => void;
  onOpenFacilitatorReview: () => void;
  onOpenProfileSkills: () => void;
  onOpenOpportunities: () => void;
  onOpenFacilitatorPortal?: () => void;
  onLanguageChangeRequest: () => void;
}

export const SkillProofScreen: React.FC<SkillProofScreenProps> = ({
  language,
  onBackToEarnPath,
  onOpenFacilitatorReview,
  onOpenProfileSkills,
  onOpenOpportunities,
  onOpenFacilitatorPortal,
  onLanguageChangeRequest,
}) => {
  const [skillProof, setSkillProof] = useState<SkillProofData>(getStoredSkillProof());
  
  // Audio recording simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Review submission animation
  const [isSubmittingAiReview, setIsSubmittingAiReview] = useState(false);
  const [reviewStepsDone, setReviewStepsDone] = useState(0);

  // Sync on mount
  useEffect(() => {
    setSkillProof(getStoredSkillProof());
  }, []);

  // Timer for recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration((prev) => {
          if (prev >= 60) {
            setIsRecording(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Evidence update helpers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const updated = updateSkillProofEvidence({
          photoUrl: url,
          photoName: file.name,
        });
        setSkillProof(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    const updated = updateSkillProofEvidence({
      photoUrl: SAMPLE_PROJECT_PHOTO,
      photoName: 'bench_multimeter_diagnostic.jpg',
    });
    setSkillProof(updated);
  };

  const handleRemovePhoto = () => {
    const updated = updateSkillProofEvidence({
      photoUrl: undefined,
      photoName: undefined,
    });
    setSkillProof(updated);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    setRecordedAudioUrl(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedAudioUrl('simulated_audio_track');
    const updated = updateSkillProofEvidence({
      audioDurationSeconds: recordDuration || 45,
      audioTranscript: SAMPLE_VOICE_TRANSCRIPT,
    });
    setSkillProof(updated);
  };

  const handleUseSampleVoice = () => {
    const updated = updateSkillProofEvidence({
      audioDurationSeconds: 42,
      audioTranscript: SAMPLE_VOICE_TRANSCRIPT,
    });
    setSkillProof(updated);
  };

  const handleNoteChange = (text: string) => {
    const updated = updateSkillProofEvidence({ note: text });
    setSkillProof(updated);
  };

  // Check evidence count (at least 2 required: photo, audio, or note)
  const hasPhoto = Boolean(skillProof.evidence.photoUrl);
  const hasAudio = Boolean(skillProof.evidence.audioTranscript || skillProof.evidence.audioDurationSeconds);
  const hasNote = Boolean(skillProof.evidence.note?.trim());
  const evidenceCount = (hasPhoto ? 1 : 0) + (hasAudio ? 1 : 0) + (hasNote ? 1 : 0);
  const isEligibleToSubmit = evidenceCount >= 2;

  // Handle Submission with 1.8s AI review animation
  const handleSubmitEvidence = () => {
    setIsSubmittingAiReview(true);
    setReviewStepsDone(0);

    const t1 = setTimeout(() => setReviewStepsDone(1), 350);
    const t2 = setTimeout(() => setReviewStepsDone(2), 700);
    const t3 = setTimeout(() => setReviewStepsDone(3), 1100);
    const t4 = setTimeout(() => setReviewStepsDone(4), 1500);
    const t5 = setTimeout(() => {
      const updated = submitSkillProof();
      setSkillProof(updated);
      setIsSubmittingAiReview(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  };

  // PROCESSING ANIMATION OVERLAY
  if (isSubmittingAiReview) {
    const reviewChecks = [
      'Checking required evidence',
      'Reviewing explanation',
      'Looking for safety awareness',
      'Preparing preliminary feedback',
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center notebook-ruled-bg p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0A1931] text-[#F4C84A] flex items-center justify-center mb-5 shadow-[3px_3px_0px_#F4C84A]">
          <ShieldCheck className="w-8 h-8 animate-pulse text-[#58B98C]" />
        </div>
        <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0A1931] font-sans">
          Reviewing your SkillProof
        </h2>
        <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
          AI प्राथमिक पडताळणी तयार होत आहे... (अंतिम निर्णय मार्गदर्शकाचा असेल)
        </p>

        <div className="w-full max-w-sm mt-6 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931] text-left space-y-3">
          {reviewChecks.map((check, index) => {
            const isDone = reviewStepsDone > index;
            return (
              <div key={check} className={`flex items-center gap-2.5 transition-opacity duration-200 ${isDone ? 'opacity-100' : 'opacity-35'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-[#58B98C] text-white' : 'border border-[#D9E1E5]'}`}>
                  {isDone ? '✓' : ''}
                </div>
                <span className="text-[13px] font-bold text-[#0A1931]">{check}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-16">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      <main className="flex-1 w-full max-w-[860px] mx-auto px-4 sm:px-6 py-6 sm:py-9">
        
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

          <AnnotationTag variant="sticky" rotation={1}>
            show, don’t just tell 📸
          </AnnotationTag>
        </div>

        {/* ============================================================== */}
        {/* STATE A: VERIFIED SUCCESS CELEBRATION                          */}
        {/* ============================================================== */}
        {skillProof.status === 'verified' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 sm:p-8 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[5px_5px_0px_#58B98C] text-center flex flex-col items-center">
              
              <div className="w-14 h-14 rounded-full bg-[#58B98C] text-white flex items-center justify-center shadow-[2px_2px_0px_#0A1931] mb-3">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#58B98C] bg-[#58B98C]/15 px-3 py-1 rounded-md">
                SKILL VERIFIED · कौशल्य सिद्ध झाले
              </span>

              <h1 className="text-[26px] sm:text-[34px] font-extrabold text-[#0A1931] tracking-tight mt-2 font-sans">
                {language === 'mr' ? skillProof.skillTitleMr : skillProof.skillTitle}
              </h1>

              <p className="text-[14px] text-[#64748B] mt-1 max-w-md font-devanagari">
                Verified by {skillProof.mentorReview?.reviewerName || 'Master Trainer, District Vocational Center'} on {skillProof.verifiedAt || 'Today'}.
              </p>

              {/* Verified Badge Medallion */}
              <div className="my-6">
                <VerifiedSkillBadge
                  skillTitle={skillProof.skillTitle}
                  skillTitleMr={skillProof.skillTitleMr}
                  verifiedDate={skillProof.verifiedAt}
                  reviewerName={skillProof.mentorReview?.reviewerName}
                  language={language}
                />
              </div>

              {/* Mentor Comment Quote */}
              {skillProof.mentorReview?.feedbackNote && (
                <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-left max-w-lg w-full mb-4">
                  <span className="text-[11px] font-bold uppercase text-[#64748B] block mb-1">
                    Mentor Note · मार्गदर्शकाचा शेरा:
                  </span>
                  <p className="text-[14px] text-[#0A1931] italic font-serif">
                    “{skillProof.mentorReview.feedbackNote}”
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <PrimaryButton fullWidth size="md" onClick={onOpenOpportunities} icon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}>
                  Explore Opportunities
                </PrimaryButton>
                <SecondaryButton fullWidth size="md" onClick={onOpenProfileSkills}>
                  View in My Profile
                </SecondaryButton>
              </div>

            </div>

            {/* Next step Card */}
            <NextStepCard
              badge="YOUR NEXT STEP"
              title="Find opportunities using this skill"
              description="Your verified diagnosis badge is ready for local apprenticeships, shops, and district center matching."
              actionText="Explore Opportunities"
              onAction={onOpenOpportunities}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE B: AWAITING MENTOR VERIFICATION OR REVIEW IN PROGRESS    */}
        {/* ============================================================== */}
        {skillProof.status === 'mentor_pending' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-7 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D9E1E5]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4C84A] animate-pulse" />
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#0A1931]">
                    Status: Awaiting Mentor Verification
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  Submitted on {skillProof.submittedAt || 'Today'}
                </span>
              </div>

              {/* Timeline Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-[#0A1931] mb-6 px-2">
                <span className="flex items-center gap-1 text-[#2E7D32]">
                  <Check className="w-4 h-4 stroke-[3]" /> Submitted
                </span>
                <span className="text-[#D9E1E5]">——</span>
                <span className="flex items-center gap-1 text-[#2E7D32]">
                  <Check className="w-4 h-4 stroke-[3]" /> AI Reviewed
                </span>
                <span className="text-[#D9E1E5]">——</span>
                <span className="flex items-center gap-1 text-[#4A7FA7] bg-[#DCECF3] px-2 py-0.5 rounded">
                  <Clock className="w-3.5 h-3.5" /> Mentor Pending
                </span>
              </div>

              {/* AI Preliminary Review Card */}
              <div className="p-5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-[#F4C84A]" />
                    <h3 className="text-[16px] font-bold text-[#0A1931] font-sans">
                      AI Preliminary Assessment · प्राथमिक अभिप्राय
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7]">
                    Not Final
                  </span>
                </div>

                {/* Qualitative Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                  {skillProof.aiReview?.categories.map((cat) => (
                    <div key={cat.name} className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5]/70">
                      <span className="text-[10px] font-bold uppercase text-[#64748B] block">
                        {language === 'mr' ? cat.nameMr : cat.name}
                      </span>
                      <span className={`text-[13px] font-bold ${cat.rating === 'Needs confirmation' ? 'text-[#B86B00]' : 'text-[#2E7D32]'}`}>
                        {cat.rating}
                      </span>
                    </div>
                  ))}
                </div>

                {/* What you did well & improve */}
                <div className="space-y-3 text-[13px]">
                  <div>
                    <span className="font-bold text-[#2E7D32] block text-xs uppercase mb-1">
                      ✓ What you did well:
                    </span>
                    <ul className="space-y-1 text-[#17212B]">
                      {skillProof.aiReview?.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#58B98C] font-bold">·</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-[#D9E1E5]/60">
                    <span className="font-bold text-[#B86B00] block text-xs uppercase mb-1">
                      ⚠️ Next points to confirm with mentor:
                    </span>
                    <ul className="space-y-1 text-[#17212B]">
                      {skillProof.aiReview?.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#B86B00] font-bold">·</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Prominent Disclaimer */}
                <div className="mt-4 p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5] text-[12px] text-[#64748B] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4A7FA7] shrink-0 mt-0.5" />
                  <span>
                    <strong>Human Authority Rule:</strong> AI feedback is only a preliminary review. Your teacher or mentor will make the final SkillProof decision.
                  </span>
                </div>
              </div>

              {/* Facilitator Demo Trigger Button */}
              <div className="p-4 rounded-xl bg-[#DCECF3]/60 border border-[#4A7FA7]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[12px] font-bold text-[#1A3D63] block">
                    Facilitator / Mentor Demo Shortcut:
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    Test the teacher review, rubric grading, and verification decisions.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenFacilitatorReview}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-[#0A1931] text-white text-[12px] font-bold hover:bg-[#1A3D63] cursor-pointer shrink-0
                  "
                >
                  <span>Open Mentor Review</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Next step Card */}
            <NextStepCard
              badge="YOUR NEXT STEP"
              title="Wait for mentor verification"
              description="You can continue learning other modules while your project is being reviewed by your district facilitator."
              actionText="Back to EarnPath"
              onAction={onBackToEarnPath}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE C: IMPROVEMENT REQUESTED (STUDENT EDIT WORKFLOW)         */}
        {/* ============================================================== */}
        {skillProof.status === 'improvement_requested' && (
          <div className="mb-6 p-5 rounded-[20px] bg-[#FFFFFF] border-2 border-[#B86B00] shadow-[4px_4px_0px_#B86B00] animate-in fade-in">
            <div className="flex items-center gap-2 mb-2 text-[#B86B00]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-[17px] font-bold text-[#0A1931] font-sans">
                Improvement Requested · सुधारणा आवश्यक
              </h3>
            </div>

            <p className="text-[14px] text-[#17212B] leading-relaxed">
              Your mentor wants you to improve one part before verification. Your previous submission has been preserved below so you can simply update the requested step.
            </p>

            {skillProof.mentorReview?.feedbackNote && (
              <div className="my-3 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
                <span className="text-[11px] font-bold uppercase text-[#64748B] block mb-1">
                  Mentor Request Note:
                </span>
                <p className="text-[14px] font-medium text-[#0A1931] italic">
                  “{skillProof.mentorReview.feedbackNote}”
                </p>
                {skillProof.mentorReview.improvementReasons && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skillProof.mentorReview.improvementReasons.map((r) => (
                      <span key={r} className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#B86B00] text-[#B86B00]">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE D: SUBMISSION FORM (UNLOCKED / DRAFT / EDITING)           */}
        {/* ============================================================== */}
        {(skillProof.status === 'unlocked' || skillProof.status === 'draft' || skillProof.status === 'improvement_requested') && (
          <div className="space-y-6">
            
            {/* Project Brief Card */}
            <div className="p-6 sm:p-7 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest bg-[#0A1931] text-[#FAF9F4] px-3 py-1 rounded-md shadow-xs">
                  SKILLPROOF PROJECT · प्रात्यक्षिक प्रकल्प
                </span>
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  Week 4 Milestone
                </span>
              </div>

              <h1 className="text-[22px] sm:text-[28px] font-extrabold text-[#0A1931] tracking-tight font-sans mt-2">
                {language === 'mr' ? skillProof.projectTitleMr : skillProof.projectTitle}
              </h1>

              <div className="my-4 p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
                <span className="text-[11px] font-bold uppercase text-[#4A7FA7] block mb-1">
                  Practical Task:
                </span>
                <p className="text-[15px] font-medium text-[#17212B] leading-relaxed font-devanagari">
                  {language === 'mr' ? skillProof.taskBriefMr : skillProof.taskBrief}
                </p>
              </div>

              {/* Requirements Checklist */}
              <div>
                <span className="text-[12px] font-bold uppercase text-[#64748B] block mb-2">
                  What you must show in your submission:
                </span>
                <div className="space-y-2 text-[14px]">
                  {(language === 'mr' ? skillProof.requirementsMr : skillProof.requirements).map((req, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[#17212B]">
                      <span className="w-5 h-5 rounded-full bg-[#FAF9F4] border border-[#0A1931] text-[#0A1931] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-devanagari">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9E1E5] text-xs text-[#64748B] italic">
                * Note: Do NOT perform risky soldering or teardowns. Demonstrating diagnostic thinking and safe handling on a bench is sufficient.
              </div>
            </div>

            {/* EVIDENCE SECTION: PHOTO + VOICE + NOTE */}
            <div className="p-6 sm:p-7 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#D9E1E5]">
                <div>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] font-sans">
                    Submit Practical Evidence · पुरावे जोडा
                  </h3>
                  <p className="text-[13px] text-[#64748B] font-devanagari">
                    At least TWO evidence types are required (Photo + Voice recommended).
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#DCECF3] text-[#0A1931]">
                  {evidenceCount} / 2 Ready
                </span>
              </div>

              {/* 1. PHOTO EVIDENCE */}
              <div className="mb-6 pb-6 border-b border-[#D9E1E5]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4.5 h-4.5 text-[#4A7FA7]" />
                    <h4 className="text-[15px] font-bold text-[#0A1931]">
                      1. Photo Evidence (Workmat / Multimeter / Phone inspection)
                    </h4>
                  </div>
                  {hasPhoto && (
                    <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Photo Attached
                    </span>
                  )}
                </div>

                {hasPhoto ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border-2 border-[#0A1931] max-w-sm max-h-[260px] bg-[#FAF9F4]">
                      <img
                        src={skillProof.evidence.photoUrl}
                        alt="Submitted phone diagnosis bench"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[13px] font-bold text-[#4A7FA7] hover:underline cursor-pointer"
                      >
                        Replace Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-[13px] font-bold text-[#C62828] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border-2 border-dashed border-[#D9E1E5] bg-[#FAF9F4] text-center flex flex-col items-center">
                    <Camera className="w-8 h-8 text-[#64748B] mb-2 opacity-60" />
                    <p className="text-[13px] text-[#64748B] max-w-sm mb-3">
                      Take or upload a clear photo of the phone, tools, or multimeter reading.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="
                          inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                          bg-[#0A1931] hover:bg-[#1A3D63] text-white text-[13px] font-bold cursor-pointer
                        "
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleUseSamplePhoto}
                        className="
                          inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                          bg-[#FFFFFF] border border-[#0A1931] text-[13px] font-bold text-[#0A1931] cursor-pointer
                        "
                      >
                        <span>Use Demo Bench Photo</span>
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* 2. VOICE EXPLANATION */}
              <div className="mb-6 pb-6 border-b border-[#D9E1E5]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4.5 h-4.5 text-[#EF6F61]" />
                    <h4 className="text-[15px] font-bold text-[#0A1931]">
                      2. Voice Explanation · आवाजात सांगा
                    </h4>
                  </div>
                  {hasAudio && (
                    <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Recorded ({skillProof.evidence.audioDurationSeconds}s)
                    </span>
                  )}
                </div>

                {isRecording ? (
                  <div className="p-4 rounded-xl bg-[#FAF9F4] border-2 border-[#EF6F61] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#EF6F61] animate-ping" />
                      <span className="text-[14px] font-bold text-[#0A1931]">
                        Recording: {recordDuration}s / 60s
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-4 py-1.5 rounded-lg bg-[#EF6F61] text-white font-bold text-[13px] cursor-pointer"
                    >
                      Stop Recording
                    </button>
                  </div>
                ) : hasAudio ? (
                  <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-[#58B98C]" />
                        <span className="text-[13px] font-bold text-[#0A1931]">
                          Voice explanation ready ({skillProof.evidence.audioDurationSeconds}s)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="text-[12px] font-bold text-[#4A7FA7] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Re-record
                      </button>
                    </div>

                    {/* Transcript preview */}
                    {skillProof.evidence.audioTranscript && (
                      <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5]/70 text-[13px]">
                        <span className="text-[11px] font-bold uppercase text-[#64748B] block mb-1">
                          Speech Transcript / संभाषण मजकूर:
                        </span>
                        <p className="text-[#17212B] font-devanagari italic leading-snug">
                          “{skillProof.evidence.audioTranscript}”
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[13px] text-[#64748B] font-devanagari">
                      Record a 30–60 second explanation in Marathi, Hindi, or English.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="
                          inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                          bg-[#0A1931] hover:bg-[#1A3D63] text-white text-[13px] font-bold cursor-pointer
                        "
                      >
                        <Mic className="w-4 h-4 text-[#F4C84A]" />
                        <span>Record Voice</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleUseSampleVoice}
                        className="text-xs font-bold text-[#0A1931] underline cursor-pointer px-2"
                      >
                        Use Sample Audio
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. OPTIONAL TEXT NOTE */}
              <div>
                <label htmlFor="student-note" className="block text-[14px] font-bold text-[#0A1931] mb-1">
                  3. Optional Note for Mentor (अतिरिक्त टिप्पणी)
                </label>
                <textarea
                  id="student-note"
                  rows={2}
                  maxLength={400}
                  value={skillProof.evidence.note || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="e.g. Tested on a Redmi Note 9. Battery showed 0V before jumper."
                  className="w-full p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-[14px] text-[#0A1931] focus:outline-none focus:border-[#0A1931]"
                />
              </div>

              {/* SUBMISSION CHECKLIST & DISCLAIMER */}
              <div className="mt-7 pt-5 border-t border-[#D9E1E5]">
                <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] mb-5">
                  <span className="text-[12px] font-bold uppercase text-[#0A1931] block mb-2">
                    Your SkillProof includes:
                  </span>
                  <div className="space-y-1 text-[13px]">
                    <div className={`flex items-center gap-2 ${hasPhoto ? 'text-[#2E7D32] font-semibold' : 'text-[#64748B]'}`}>
                      <span>{hasPhoto ? '✓' : '○'}</span>
                      <span>Project photo evidence ({hasPhoto ? 'Ready' : 'Not added'})</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasAudio ? 'text-[#2E7D32] font-semibold' : 'text-[#64748B]'}`}>
                      <span>{hasAudio ? '✓' : '○'}</span>
                      <span>Voice explanation ({hasAudio ? 'Ready' : 'Not added'})</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasNote ? 'text-[#2E7D32] font-semibold' : 'text-[#64748B]'}`}>
                      <span>{hasNote ? '✓' : '○'}</span>
                      <span>Optional student note</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/60 text-xs text-[#1A3D63] font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#4A7FA7] shrink-0" />
                    <span>AI will provide preliminary feedback. A human mentor will make the final verification.</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <PrimaryButton
                    fullWidth
                    size="lg"
                    disabled={!isEligibleToSubmit}
                    onClick={handleSubmitEvidence}
                    icon={<Check className="w-5 h-5 stroke-[2.75]" />}
                  >
                    Submit for Review
                  </PrimaryButton>
                  <SecondaryButton
                    size="lg"
                    onClick={onBackToEarnPath}
                  >
                    Save as Draft & Exit
                  </SecondaryButton>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};
