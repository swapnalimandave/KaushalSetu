import React from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Mic,
  FileText,
  ShieldCheck,
  Check,
  Calendar,
} from 'lucide-react';
import { LearnerRecord, FacilitatorMetrics, LanguageCode, FacilitatorSection } from '../../types';
import { FACILITATOR_PROFILE_INFO } from '../../data/facilitatorData';
import { ReviewQueueItem } from '../../utils/facilitatorManager';

interface FacilitatorOverviewViewProps {
  metrics: FacilitatorMetrics;
  learners: LearnerRecord[];
  reviewQueue: ReviewQueueItem[];
  language: LanguageCode;
  onNavigateSection: (section: FacilitatorSection, extraId?: string) => void;
  onSelectLearner: (learnerId: string) => void;
  onSelectReview: (reviewId: string) => void;
  onResolveAttention: (learnerId: string) => void;
}

export const FacilitatorOverviewView: React.FC<FacilitatorOverviewViewProps> = ({
  metrics,
  learners,
  reviewQueue,
  language,
  onNavigateSection,
  onSelectLearner,
  onSelectReview,
  onResolveAttention,
}) => {
  const needsAttentionList = learners.filter((l) => l.needsAttention);
  const pendingReviews = reviewQueue.filter((r) => r.needsReviewAction);

  return (
    <div className="space-y-6">
      {/* Welcome & Center Context Header */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 md:p-6 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#58B98C]/15 text-[#1B6644] border border-[#58B98C]/30">
                {language === 'mr' ? 'कौशल्य केंद्र चालू' : 'Center Active'}
              </span>
              <span className="text-xs text-[#556987]">
                {FACILITATOR_PROFILE_INFO.district}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#0A1931] mt-1.5">
              {language === 'mr'
                ? `शुभ प्रभात, ${FACILITATOR_PROFILE_INFO.nameMr}`
                : `Good Morning, ${FACILITATOR_PROFILE_INFO.name}`}
            </h2>
            <p className="text-sm text-[#556987] mt-0.5">
              {language === 'mr'
                ? 'आज तुमच्या तुकडीत २८ पैकी २४ विद्यार्थी शिकत आहेत. २ विद्यार्थ्यांकडे तातडीने लक्ष देणे आवश्यक आहे.'
                : '24 of 28 learners active this week. 2 learners flagged for mentor attention today.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateSection('skillproof')}
              className="px-4 py-2 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#F4C84A]" />
              <span>
                {language === 'mr'
                  ? `पडताळणी रांग (${pendingReviews.length})`
                  : `Review Queue (${pendingReviews.length})`}
              </span>
            </button>
            <button
              onClick={() => onNavigateSection('learners')}
              className="px-4 py-2 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] text-xs font-bold hover:bg-[#FFFFFF] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#4A7FA7]" />
              <span>{language === 'mr' ? 'सर्व विद्यार्थी पहा' : 'View All Learners'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Operational Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-[#D9E1E5]/80">
          {/* Metric 1 */}
          <div
            onClick={() => onNavigateSection('learners')}
            className="p-3.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] hover:border-[#4A7FA7] cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[#556987] text-xs font-semibold">
              <span>{language === 'mr' ? 'सक्रिय विद्यार्थी' : 'Active Learners'}</span>
              <Users className="w-4 h-4 text-[#4A7FA7]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#0A1931]">
                {metrics.activeThisWeek}
              </span>
              <span className="text-xs text-[#556987]">/ {metrics.totalEnrolled} total</span>
            </div>
            <div className="mt-2 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#58B98C] h-full rounded-full"
                style={{ width: `${(metrics.activeThisWeek / metrics.totalEnrolled) * 100}%` }}
              />
            </div>
          </div>

          {/* Metric 2 */}
          <div
            onClick={() => onNavigateSection('learners')}
            className="p-3.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] hover:border-[#EF6F61] cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[#556987] text-xs font-semibold">
              <span>{language === 'mr' ? 'मदतीची गरज' : 'Needs Attention'}</span>
              <AlertTriangle className="w-4 h-4 text-[#EF6F61]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#EF6F61]">
                {metrics.needsAttentionCount}
              </span>
              <span className="text-xs text-[#556987]">
                {language === 'mr' ? 'तातडीचे' : 'actionable'}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#EF6F61] font-semibold truncate">
              {metrics.needsAttentionCount > 0 ? 'Quiz fail & offline lag' : 'All learners on track'}
            </p>
          </div>

          {/* Metric 3 */}
          <div
            onClick={() => onNavigateSection('skillproof')}
            className="p-3.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] hover:border-[#F4C84A] cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[#556987] text-xs font-semibold">
              <span>{language === 'mr' ? 'पडताळणी प्रलंबित' : 'Pending SkillProof'}</span>
              <Award className="w-4 h-4 text-[#F4C84A]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#0A1931]">
                {metrics.skillProofPendingCount}
              </span>
              <span className="text-xs text-[#556987]">
                {language === 'mr' ? 'पुरावे सादर' : 'submitted'}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#4A7FA7] font-semibold truncate">
              {language === 'mr' ? 'रवी व पूजा यांचे पुरावे तयार' : 'Ravi & Pooja waiting'}
            </p>
          </div>

          {/* Metric 4 */}
          <div
            onClick={() => onNavigateSection('opportunities')}
            className="p-3.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] hover:border-[#58B98C] cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[#556987] text-xs font-semibold">
              <span>{language === 'mr' ? 'रोजगार अर्ज चालू' : 'In Opportunity Flow'}</span>
              <Briefcase className="w-4 h-4 text-[#58B98C]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#0A1931]">
                {metrics.applicationsUnderwayCount}
              </span>
              <span className="text-xs text-[#556987]">
                {language === 'mr' ? 'स्थानिक संधी' : 'candidates'}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#1B6644] font-semibold truncate">
              {language === 'mr' ? '१ मुलाखत गुरुवारी' : '1 interview this Thu'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Attention Queue + Pending SkillProofs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Needs Attention Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF6F61] animate-pulse" />
              <h3 className="text-base font-bold text-[#0A1931]">
                {language === 'mr' ? 'आज लक्ष देण्याची गरज असलेले विद्यार्थी' : 'Learners Needing Attention Today'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#556987]">
              {needsAttentionList.length} flagged
            </span>
          </div>

          {needsAttentionList.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-[#58B98C] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0A1931]">
                {language === 'mr' ? 'सर्व विद्यार्थी व्यवस्थित शिकत आहेत!' : 'All learners are progressing smoothly!'}
              </p>
              <p className="text-xs text-[#556987] mt-1">
                No active flags or blockers reported in the cohort today.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {needsAttentionList.map((learner) => (
                <div
                  key={learner.id}
                  className="bg-[#FFFFFF] border-2 border-[#EF6F61]/40 hover:border-[#EF6F61] rounded-xl p-4 shadow-[2px_2px_0px_rgba(239,111,97,0.1)] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EF6F61]/15 text-[#C62828] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {learner.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectLearner(learner.id)}
                            className="font-bold text-[#0A1931] hover:text-[#4A7FA7] hover:underline text-sm text-left"
                          >
                            {language === 'mr' ? learner.nameMr : learner.name}
                          </button>
                          <span className="text-xs text-[#556987]">
                            · {learner.village}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A7FA7] font-medium mt-0.5">
                          {language === 'mr' ? learner.careerTrackMr : learner.careerTrack}
                          {' · '}Week {learner.currentWeek}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EF6F61]/15 text-[#C62828]">
                      {learner.attentionSeverity} priority
                    </span>
                  </div>

                  {/* Flag Reason */}
                  <div className="mt-3 p-2.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-xs text-[#17212B]">
                    <span className="font-bold text-[#C62828] mr-1.5">Issue:</span>
                    {language === 'mr' ? learner.attentionReasonMr : learner.attentionReason}
                  </div>

                  {/* Action Bar */}
                  <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${learner.phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] hover:border-[#4A7FA7] font-semibold"
                      >
                        <PhoneCall className="w-3 h-3 text-[#4A7FA7]" />
                        <span>{learner.phone}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onResolveAttention(learner.id)}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-[#58B98C] hover:bg-[#58B98C]/10 border border-transparent hover:border-[#58B98C]/30 transition-all cursor-pointer"
                      >
                        {language === 'mr' ? 'सोडवले' : 'Mark Resolved'}
                      </button>
                      <button
                        onClick={() => onSelectLearner(learner.id)}
                        className="px-3 py-1 rounded bg-[#0A1931] text-[#FAF9F4] font-semibold hover:bg-[#17212B] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>{language === 'mr' ? 'तपशील' : 'View Learner'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Cohort Progress Bar */}
          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#0A1931] mb-2">
              <span>{language === 'mr' ? 'तुकडी प्रगती स्थिती' : 'Cohort Journey Distribution'}</span>
              <button
                onClick={() => onNavigateSection('learners')}
                className="text-[#4A7FA7] hover:underline"
              >
                {language === 'mr' ? 'तपशीलवार यादी' : 'View breakdown'}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#FAF9F4] border border-[#D9E1E5]">
                <p className="font-bold text-[#0A1931] text-base">4</p>
                <p className="text-[10px] text-[#556987]">Discovering</p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F4] border border-[#D9E1E5]">
                <p className="font-bold text-[#4A7FA7] text-base">14</p>
                <p className="text-[10px] text-[#556987]">In EarnPath</p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F4] border border-[#F4C84A]">
                <p className="font-bold text-[#D97706] text-base">6</p>
                <p className="text-[10px] text-[#556987]">SkillProof</p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F4] border border-[#58B98C]">
                <p className="font-bold text-[#1B6644] text-base">4</p>
                <p className="text-[10px] text-[#556987]">Placement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pending SkillProof Queue + Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-base font-bold text-[#0A1931]">
                {language === 'mr' ? 'कौशल्य पडताळणी रांग' : 'SkillProof Review Queue'}
              </h3>
            </div>
            <button
              onClick={() => onNavigateSection('skillproof')}
              className="text-xs font-bold text-[#4A7FA7] hover:underline"
            >
              {language === 'mr' ? 'सर्व पहा' : 'View all'}
            </button>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border-2 border-[#F4C84A] rounded-xl p-4 shadow-[2px_2px_0px_rgba(244,200,74,0.3)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4C84A] text-[#0A1931]">
                    Pending Verification
                  </span>
                  <span className="text-xs text-[#556987] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.submittedAt}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h4 className="font-bold text-sm text-[#0A1931]">
                    {language === 'mr' ? item.learnerNameMr : item.learnerName}
                  </h4>
                  <p className="text-xs text-[#4A7FA7] font-medium">
                    {language === 'mr' ? item.skillTitleMr : item.skillTitle}
                  </p>
                  <p className="text-[11px] text-[#556987] mt-0.5">
                    {language === 'mr' ? item.pathwayTitleMr : item.pathwayTitle}
                  </p>
                </div>

                {/* Evidence badges */}
                <div className="mt-3 flex items-center gap-2 text-xs text-[#556987]">
                  {item.evidencePhotoCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#D9E1E5]">
                      <Camera className="w-3 h-3 text-[#4A7FA7]" />
                      {item.evidencePhotoCount} photo
                    </span>
                  )}
                  {item.hasAudio && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#D9E1E5]">
                      <Mic className="w-3 h-3 text-[#EF6F61]" />
                      Voice note
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#DCECF3] text-[#2C5E82]">
                    <Sparkles className="w-3 h-3 text-[#2C5E82]" />
                    AI Screened
                  </span>
                </div>

                {/* AI Preliminary Insight */}
                <div className="mt-2.5 p-2 rounded bg-[#FAF9F4] border border-[#D9E1E5] text-[11px] text-[#0A1931]">
                  <span className="font-bold text-[#4A7FA7]">AI Rubric: </span>
                  {item.aiSummaryBadge}
                </div>

                {/* CTA to evaluate */}
                <button
                  onClick={() => onSelectReview(item.id)}
                  className="mt-3 w-full py-2 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F4C84A]" />
                  <span>
                    {language === 'mr'
                      ? 'मूल्यमापन व स्वाक्षरी करा'
                      : 'Evaluate & Sign Off SkillProof'}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Recent Cohort Milestones */}
          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#556987] mb-3">
              {language === 'mr' ? 'नुकतेच साध्य झालेले टप्पे' : 'Recent Cohort Milestones'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-[#D9E1E5]/60">
                <div className="w-6 h-6 rounded-full bg-[#58B98C]/20 text-[#1B6644] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-[#0A1931]">
                    Mahesh More · EV Technician Skill Verified
                  </p>
                  <p className="text-[11px] text-[#556987]">
                    Shop interview confirmed at GreenWheels Satara for Thursday.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2.5 border-b border-[#D9E1E5]/60">
                <div className="w-6 h-6 rounded-full bg-[#4A7FA7]/20 text-[#2C5E82] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-[#0A1931]">
                    Ravi Patil · Submitted Multimeter SkillProof
                  </p>
                  <p className="text-[11px] text-[#556987]">
                    Matched with Sai Electronics & Mobile Care (10 km).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#F4C84A]/30 text-[#0A1931] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-[#0A1931]">
                    Pooja Shinde · Solar Array Disconnect Practice
                  </p>
                  <p className="text-[11px] text-[#556987]">
                    Completed 14 of 16 lessons with 90% average quiz score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
