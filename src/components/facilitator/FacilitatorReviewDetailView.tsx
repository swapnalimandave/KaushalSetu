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
  Play,
  Pause,
  Award,
} from 'lucide-react';
import { LanguageCode, SkillProofData } from '../../types';
import { getStoredSkillProof } from '../../utils/skillProofManager';
import { performMentorReview } from '../../utils/facilitatorManager';

interface FacilitatorReviewDetailViewProps {
  skillProofId: string;
  language: LanguageCode;
  onBackToQueue: () => void;
  onViewLearner: (learnerId: string) => void;
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
  'Safety step missing (battery disconnect)',
  'Evidence photo unclear or incomplete',
  'Diagnosis process needs clearer logic',
];

export const FacilitatorReviewDetailView: React.FC<FacilitatorReviewDetailViewProps> = ({
  skillProofId,
  language,
  onBackToQueue,
  onViewLearner,
}) => {
  const [skillProof, setSkillProof] = useState<SkillProofData>(() => getStoredSkillProof());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [decisionMode, setDecisionMode] = useState<'verify' | 'request_improvement'>('verify');
  const [rubricScores, setRubricScores] = useState<Record<string, 'Meets' | 'Needs Improvement'>>({
    [RUBRIC_CRITERIA[0]]: 'Meets',
    [RUBRIC_CRITERIA[1]]: 'Meets',
    [RUBRIC_CRITERIA[2]]: 'Meets',
    [RUBRIC_CRITERIA[3]]: 'Meets',
    [RUBRIC_CRITERIA[4]]: 'Meets',
  });
  const [selectedReasons, setSelectedReasons] = useState<string[]>(['Safety step missing (battery disconnect)']);
  const [mentorFeedbackNote, setMentorFeedbackNote] = useState(
    'Ravi demonstrated safe multimeter handling and understood the charging circuit principles. Approved for foundational SkillProof.'
  );
  const [decisionSubmitted, setDecisionSubmitted] = useState<string | null>(null);

  const toggleCriterion = (criterion: string) => {
    setRubricScores((prev) => ({
      ...prev,
      [criterion]: prev[criterion] === 'Meets' ? 'Needs Improvement' : 'Meets',
    }));
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleSubmitDecision = () => {
    performMentorReview(
      skillProofId,
      decisionMode,
      mentorFeedbackNote,
      selectedReasons
    );

    const message =
      decisionMode === 'verify'
        ? 'Skill Verified! Verified Skill Badge has been issued to Ravi Patil.'
        : 'Feedback sent to student. They have been notified to update their evidence.';

    setDecisionSubmitted(message);

    setTimeout(() => {
      onBackToQueue();
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToQueue}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A7FA7] hover:text-[#0A1931] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'पडताळणी रांगेकडे परत' : 'Back to Verification Queue'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#556987]">Candidate:</span>
          <button
            onClick={() => onViewLearner('ravi-patil-18')}
            className="text-xs font-bold text-[#0A1931] hover:underline"
          >
            Ravi Patil (रवी पाटील)
          </button>
        </div>
      </div>

      {/* Decision confirmation banner if submitted */}
      {decisionSubmitted && (
        <div className="p-4 rounded-xl bg-[#58B98C] text-white flex items-center gap-3 animate-fade-in shadow-lg">
          <Check className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold text-sm">{decisionSubmitted}</p>
            <p className="text-xs opacity-90">Updating cohort ledger and returning to queue...</p>
          </div>
        </div>
      )}

      {/* Two-Column Review Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Submitted Evidence (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 shadow-[2px_2px_0px_rgba(10,25,49,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#D9E1E5] text-[#556987]">
                Practical Evidence
              </span>
              <span className="text-xs text-[#556987]">Project: Basic Mobile Diagnosis</span>
            </div>

            {/* Photo Preview */}
            <div>
              <p className="text-xs font-bold text-[#0A1931] mb-2 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#4A7FA7]" />
                <span>1. Bench Diagnostic Photo</span>
              </p>
              {skillProof.evidence?.photoUrl ? (
                <div className="rounded-lg border border-[#D9E1E5] overflow-hidden bg-[#FAF9F4]">
                  <img
                    src={skillProof.evidence.photoUrl}
                    alt="Diagnosis bench evidence"
                    className="w-full h-52 object-contain bg-[#FAF9F4]"
                  />
                  <div className="p-2 border-t border-[#D9E1E5] text-[11px] text-[#556987] flex items-center justify-between">
                    <span>{skillProof.evidence.photoName || 'phone_multimeter_inspection.jpg'}</span>
                    <span className="text-[#58B98C] font-semibold">✓ High Resolution</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-[#D9E1E5] rounded-lg text-xs text-[#556987]">
                  No photo attached
                </div>
              )}
            </div>

            {/* Audio Note & Transcript */}
            <div className="pt-2 border-t border-[#D9E1E5]">
              <p className="text-xs font-bold text-[#0A1931] mb-2 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-[#EF6F61]" />
                <span>2. Audio Explanation (Marathi)</span>
              </p>

              {/* Audio Player simulation */}
              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#F4C84A]" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#F4C84A]" />
                        <span>Play Voice Note (42s)</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs text-[#556987] font-mono">
                    {isPlayingAudio ? '00:18 / 00:42' : '00:42'}
                  </span>
                </div>

                {/* Audio transcript box */}
                <div className="mt-2 p-2.5 rounded bg-white border border-[#D9E1E5] text-xs space-y-1.5">
                  <p className="font-bold text-[#4A7FA7] text-[11px]">Marathi Transcript:</p>
                  <p className="font-devanagari text-[#17212B] leading-relaxed">
                    "{skillProof.evidence?.audioTranscript}"
                  </p>
                  <p className="text-[10px] text-[#556987] italic pt-1 border-t border-[#D9E1E5]/60">
                    Translation: "I checked this phone because it does not charge. Two possible causes: pocket lint inside Type-C port or battery 0V. I measured voltage at 3.78V. Next, I will clean port contact pins."
                  </p>
                </div>
              </div>
            </div>

            {/* AI Preliminary Review Box */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#BACDD8] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C5E82]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Preliminary Rubric Screening</span>
              </div>
              <p className="text-[11px] text-[#556987]">
                Automated check verifies student named appropriate tools and demonstrated diagnosis sequence. Mentors provide final judgment.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded bg-white border border-[#D9E1E5]">
                  <span className="text-[#556987] text-[10px] block">Tool Awareness</span>
                  <span className="font-bold text-[#1B6644]">Good (Multimeter + picks)</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#D9E1E5]">
                  <span className="text-[#556987] text-[10px] block">Safety Protocol</span>
                  <span className="font-bold text-[#D97706]">Verify battery disconnect</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mentor Evaluation Rubric & Sign-off (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FFFFFF] border-2 border-[#0A1931] rounded-xl p-5 shadow-[3px_3px_0px_#0A1931] space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4A7FA7]" />
                <h3 className="font-bold font-serif text-lg text-[#0A1931]">
                  Mentor Evaluation Rubric
                </h3>
              </div>
              <p className="text-xs text-[#556987] mt-0.5">
                Evaluate Ravi Patil against foundational skill standards before issuing credential.
              </p>
            </div>

            {/* Rubric Criteria Checklist */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#0A1931]">Verify Rubric Items:</p>
              {RUBRIC_CRITERIA.map((criterion, idx) => {
                const meets = rubricScores[criterion] === 'Meets';
                return (
                  <div
                    key={criterion}
                    onClick={() => toggleCriterion(criterion)}
                    className={`
                      p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all
                      ${
                        meets
                          ? 'bg-[#FAF9F4] border-[#58B98C] text-[#1B6644]'
                          : 'bg-[#FFF9F8] border-[#EF6F61] text-[#C62828]'
                      }
                    `}
                  >
                    <span className="font-medium text-[#17212B]">
                      {idx + 1}. {criterion}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        meets
                          ? 'bg-[#58B98C] text-white'
                          : 'bg-[#EF6F61] text-white'
                      }`}
                    >
                      {meets ? '✓ Meets' : 'Needs Work'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Decision Mode Toggle */}
            <div className="pt-3 border-t border-[#D9E1E5] space-y-2">
              <p className="text-xs font-bold text-[#0A1931]">Mentor Decision:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDecisionMode('verify')}
                  className={`
                    p-3 rounded-lg border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all
                    ${
                      decisionMode === 'verify'
                        ? 'bg-[#FAF9F4] border-[#58B98C] text-[#1B6644] shadow-[2px_2px_0px_#58B98C]'
                        : 'bg-[#FAF9F4] border-[#D9E1E5] text-[#556987]'
                    }
                  `}
                >
                  <Award className="w-4 h-4 text-[#58B98C]" />
                  <span>Approve & Verify</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionMode('request_improvement')}
                  className={`
                    p-3 rounded-lg border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all
                    ${
                      decisionMode === 'request_improvement'
                        ? 'bg-[#FFF9F8] border-[#EF6F61] text-[#C62828] shadow-[2px_2px_0px_#EF6F61]'
                        : 'bg-[#FAF9F4] border-[#D9E1E5] text-[#556987]'
                    }
                  `}
                >
                  <AlertTriangle className="w-4 h-4 text-[#EF6F61]" />
                  <span>Request Improvement</span>
                </button>
              </div>
            </div>

            {/* If Request Improvement: reasons checkboxes */}
            {decisionMode === 'request_improvement' && (
              <div className="p-3 rounded-lg bg-[#FFF9F8] border border-[#EF6F61]/40 space-y-2">
                <p className="text-xs font-bold text-[#C62828]">Select Improvement Reasons:</p>
                {IMPROVEMENT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 text-xs text-[#17212B] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(reason)}
                      onChange={() => toggleReason(reason)}
                      className="rounded border-[#D9E1E5] text-[#EF6F61]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Mentor Feedback Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0A1931]">
                Mentor Feedback & Advice for Learner:
              </label>
              <textarea
                rows={3}
                value={mentorFeedbackNote}
                onChange={(e) => setMentorFeedbackNote(e.target.value)}
                placeholder="Write constructive notes for the student..."
                className="w-full p-2.5 rounded-lg border border-[#D9E1E5] text-xs text-[#0A1931] focus:outline-none focus:border-[#4A7FA7]"
              />
            </div>

            {/* Signer Info */}
            <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-xs text-[#556987] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0A1931]">Reviewer: Anita Deshmukh</p>
                <p className="text-[11px]">Training Facilitator, Satara Center</p>
              </div>
              <span className="text-[10px] font-mono">{new Date().toLocaleDateString('en-IN')}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitDecision}
              className={`
                w-full py-3 rounded-xl font-bold text-sm shadow-[2px_2px_0px_#0A1931] transition-all cursor-pointer flex items-center justify-center gap-2
                ${
                  decisionMode === 'verify'
                    ? 'bg-[#58B98C] text-white hover:bg-[#489F77]'
                    : 'bg-[#EF6F61] text-white hover:bg-[#D95547]'
                }
              `}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {decisionMode === 'verify'
                  ? 'Sign & Issue Verified Skill Badge'
                  : 'Send Improvement Request to Learner'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
