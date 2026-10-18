import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  User,
  ShieldCheck,
  Sparkles,
  Camera,
  Mic,
  FileText,
  Volume2,
  Calendar,
  Send,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode, SkillProofData } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import {
  getStoredSkillProof,
  mentorVerifySkill,
  mentorRequestImprovement,
} from '../utils/skillProofManager';

interface FacilitatorReviewScreenProps {
  language: LanguageCode;
  onBackToSkillProof: () => void;
  onLanguageChangeRequest: () => void;
}

const RUBRIC_CRITERIA = [
  'Student identified the problem clearly',
  'Student used or named appropriate tools',
  'Student demonstrated safe handling awareness',
  'Student explained a reasonable diagnosis process',
  'Student can explain the next action',
];

const IMPROVEMENT_REASONS = [
  'Explanation needs more detail',
  'Safety step missing',
  'Evidence unclear',
  'Task incomplete',
  'Diagnosis process needs improvement',
];

export const FacilitatorReviewScreen: React.FC<FacilitatorReviewScreenProps> = ({
  language,
  onBackToSkillProof,
  onLanguageChangeRequest,
}) => {
  const [skillProof, setSkillProof] = useState<SkillProofData>(getStoredSkillProof());
  
  // Mentor Rubric State
  const [rubricScores, setRubricScores] = useState<Record<string, 'Meets' | 'Needs Improvement'>>({
    [RUBRIC_CRITERIA[0]]: 'Meets',
    [RUBRIC_CRITERIA[1]]: 'Meets',
    [RUBRIC_CRITERIA[2]]: 'Meets',
    [RUBRIC_CRITERIA[3]]: 'Meets',
    [RUBRIC_CRITERIA[4]]: 'Meets',
  });

  const [decisionMode, setDecisionMode] = useState<'verify' | 'request_improvement'>('verify');
  const [mentorNote, setMentorNote] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>(['Safety step missing']);
  const [decisionSubmitted, setDecisionSubmitted] = useState<string | null>(null);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleVerify = () => {
    const updated = mentorVerifySkill('Sunil Deshmukh (Lead Vocational Trainer)');
    setSkillProof(updated);
    setDecisionSubmitted('Skill Verified! The student has received their verified badge.');
    setTimeout(() => {
      onBackToSkillProof();
    }, 1800);
  };

  const handleSendImprovementRequest = () => {
    const updated = mentorRequestImprovement(
      mentorNote || 'Please explain how you safely disconnect the battery before testing internal contacts.',
      selectedReasons
    );
    setSkillProof(updated);
    setDecisionSubmitted('Feedback sent to student. They can update their evidence directly.');
    setTimeout(() => {
      onBackToSkillProof();
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-16">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={onBackToSkillProof}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Student View</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A7FA7]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A1931]">
              Facilitator / Mentor Portal
            </span>
          </div>
        </div>

        {/* Student & Project Summary Banner */}
        <div className="p-5 sm:p-6 rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
              <span>Student Review</span>
              <span>·</span>
              <span>District Rural Skill Center</span>
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#0A1931] font-sans">
              {skillProof.studentName} · {skillProof.projectTitle}
            </h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Path: <span className="font-semibold text-[#0A1931]">{skillProof.pathwayTitle}</span> (Week 4 Practical)
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs font-bold uppercase text-[#4A7FA7] block">Current Status</span>
            <span className="text-[14px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#DCECF3] text-[#0A1931] inline-block mt-0.5">
              {skillProof.status === 'verified' ? '✓ Verified' : skillProof.status === 'mentor_pending' ? 'Pending Review' : skillProof.status}
            </span>
          </div>
        </div>

        {decisionSubmitted && (
          <div className="mb-6 p-4 rounded-xl bg-[#58B98C] text-white font-bold text-[14px] shadow-[3px_3px_0px_#0A1931] flex items-center gap-2.5 animate-in fade-in">
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{decisionSubmitted}</span>
          </div>
        )}

        {/* 2-COLUMN LAYOUT: STUDENT EVIDENCE (LEFT) + MENTOR RUBRIC (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: STUDENT EVIDENCE */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="p-5 sm:p-6 rounded-[20px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
              <h3 className="text-[16px] font-bold text-[#0A1931] mb-4 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#4A7FA7]" />
                <span>Submitted Student Evidence · सादर केलेले पुरावे</span>
              </h3>

              {/* Photo Evidence Card */}
              <div className="mb-5 pb-5 border-b border-[#D9E1E5]">
                <span className="text-xs font-bold uppercase text-[#64748B] block mb-2">
                  1. Diagnostic Bench Photo:
                </span>
                {skillProof.evidence.photoUrl ? (
                  <div className="rounded-xl overflow-hidden border-2 border-[#0A1931] bg-[#FAF9F4] max-h-[280px]">
                    <img
                      src={skillProof.evidence.photoUrl}
                      alt="Submitted diagnostic bench"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B] italic">No photo attached.</p>
                )}
              </div>

              {/* Audio & Transcript */}
              <div className="mb-5 pb-5 border-b border-[#D9E1E5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#64748B]">
                    2. Voice Explanation ({skillProof.evidence.audioDurationSeconds || 42}s):
                  </span>
                  <span className="text-xs font-semibold text-[#58B98C]">
                    ✓ Audio Captured
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#0A1931]" />
                    <span className="text-xs font-mono font-bold text-[#0A1931]">
                      Audio_Explanation_Ravi.wav
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#64748B]">0:42</span>
                </div>

                {skillProof.evidence.audioTranscript && (
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] text-[13px]">
                    <span className="text-[11px] font-bold uppercase text-[#4A7FA7] block mb-1">
                      Verified Speech Transcript:
                    </span>
                    <p className="text-[#17212B] font-devanagari italic leading-relaxed">
                      “{skillProof.evidence.audioTranscript}”
                    </p>
                  </div>
                )}
              </div>

              {/* Student Note */}
              {skillProof.evidence.note && (
                <div>
                  <span className="text-xs font-bold uppercase text-[#64748B] block mb-1">
                    3. Student Accompanying Note:
                  </span>
                  <p className="text-[13px] text-[#17212B] p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                    {skillProof.evidence.note}
                  </p>
                </div>
              )}
            </div>

            {/* AI Preliminary Review (read-only reference for mentor) */}
            <div className="p-5 rounded-[20px] bg-[#FAF9F4] border border-[#D9E1E5]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F4C84A]" />
                  <h4 className="text-[14px] font-bold text-[#0A1931]">
                    AI Preliminary Check (Suggestion Only)
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Non-Binding
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                {skillProof.aiReview?.categories.map((c) => (
                  <div key={c.name} className="p-2 rounded bg-white border border-[#D9E1E5]">
                    <span className="text-[#64748B] block text-[10px]">{c.name}</span>
                    <span className="font-bold text-[#0A1931]">{c.rating}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#64748B] italic">
                * Mentors have complete authority to override or modify any point based on vocational standards.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: HUMAN MENTOR REVIEW & DECISION */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="p-6 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]">
              <h3 className="text-[17px] font-bold text-[#0A1931] mb-1 font-sans">
                Human Review Rubric · मार्गदर्शक मूल्यमापन
              </h3>
              <p className="text-[13px] text-[#64748B] mb-4">
                Evaluate Ravi's practical safety and diagnostic process against standard criteria:
              </p>

              {/* Rubric Criteria Rows */}
              <div className="space-y-3 mb-6">
                {RUBRIC_CRITERIA.map((criterion, idx) => {
                  const score = rubricScores[criterion] || 'Meets';
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <span className="text-[13px] font-semibold text-[#0A1931]">
                        {idx + 1}. {criterion}
                      </span>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => setRubricScores((prev) => ({ ...prev, [criterion]: 'Meets' }))}
                          className={`
                            px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer
                            ${score === 'Meets' ? 'bg-[#58B98C] text-white shadow-xs' : 'bg-[#FFFFFF] border border-[#D9E1E5] text-[#64748B]'}
                          `}
                        >
                          Meets ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => setRubricScores((prev) => ({ ...prev, [criterion]: 'Needs Improvement' }))}
                          className={`
                            px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer
                            ${score === 'Needs Improvement' ? 'bg-[#B86B00] text-white shadow-xs' : 'bg-[#FFFFFF] border border-[#D9E1E5] text-[#64748B]'}
                          `}
                        >
                          Needs Work
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Decision Tabs */}
              <div className="pt-4 border-t border-[#D9E1E5]">
                <span className="text-xs font-bold uppercase text-[#64748B] block mb-2">
                  Mentor Decision · अंतिम निर्णय:
                </span>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setDecisionMode('verify')}
                    className={`
                      p-3 rounded-xl border-2 font-bold text-[14px] transition-all cursor-pointer text-center
                      ${decisionMode === 'verify' ? 'bg-[#58B98C]/15 border-[#58B98C] text-[#2E7D32] shadow-xs' : 'border-[#D9E1E5] text-[#64748B] hover:bg-[#FAF9F4]'}
                    `}
                  >
                    ✓ Verify Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionMode('request_improvement')}
                    className={`
                      p-3 rounded-xl border-2 font-bold text-[14px] transition-all cursor-pointer text-center
                      ${decisionMode === 'request_improvement' ? 'bg-[#B86B00]/15 border-[#B86B00] text-[#B86B00] shadow-xs' : 'border-[#D9E1E5] text-[#64748B] hover:bg-[#FAF9F4]'}
                    `}
                  >
                    ⚠️ Request Improvement
                  </button>
                </div>

                {/* Sub-form for Request Improvement */}
                {decisionMode === 'request_improvement' && (
                  <div className="space-y-3 mb-4 animate-in fade-in">
                    <div>
                      <span className="text-xs font-bold text-[#0A1931] block mb-1">
                        Select reason(s) for improvement:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {IMPROVEMENT_REASONS.map((reason) => {
                          const isSelected = selectedReasons.includes(reason);
                          return (
                            <button
                              key={reason}
                              type="button"
                              onClick={() => toggleReason(reason)}
                              className={`
                                text-xs font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer
                                ${isSelected ? 'bg-[#0A1931] text-white border-[#0A1931]' : 'bg-[#FAF9F4] border-[#D9E1E5] text-[#64748B]'}
                              `}
                            >
                              {reason}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mentor-note" className="block text-xs font-bold text-[#0A1931] mb-1">
                        Mentor Note for Student:
                      </label>
                      <textarea
                        id="mentor-note"
                        rows={2}
                        value={mentorNote}
                        onChange={(e) => setMentorNote(e.target.value)}
                        placeholder="e.g. Please re-record your voice note explaining how you disconnect the battery safely before testing."
                        className="w-full p-2.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[13px] text-[#0A1931]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Actions */}
                {decisionMode === 'verify' ? (
                  <PrimaryButton
                    fullWidth
                    size="lg"
                    onClick={handleVerify}
                    icon={<Check className="w-5 h-5 stroke-[2.75]" />}
                  >
                    Confirm & Verify Skill
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    fullWidth
                    size="lg"
                    onClick={handleSendImprovementRequest}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send Improvement Feedback
                  </PrimaryButton>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
