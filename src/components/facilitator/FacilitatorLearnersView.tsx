import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  AlertTriangle,
  ChevronRight,
  PhoneCall,
  Award,
  Briefcase,
  BookOpen,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LearnerRecord, LanguageCode } from '../../types';

interface FacilitatorLearnersViewProps {
  learners: LearnerRecord[];
  language: LanguageCode;
  onSelectLearner: (learnerId: string) => void;
  onSelectReview: (reviewId: string) => void;
}

export const FacilitatorLearnersView: React.FC<FacilitatorLearnersViewProps> = ({
  learners,
  language,
  onSelectLearner,
  onSelectReview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'attention' | 'learn' | 'prove' | 'apply' | 'outcome'>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');

  // Filtered learners
  const filteredLearners = useMemo(() => {
    return learners.filter((learner) => {
      // Search
      const matchesSearch =
        learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.nameMr.includes(searchTerm) ||
        learner.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.phone.includes(searchTerm) ||
        learner.careerTrack.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Stage filter
      if (stageFilter === 'attention' && !learner.needsAttention) return false;
      if (stageFilter === 'learn' && learner.currentStage !== 'learn') return false;
      if (stageFilter === 'prove' && learner.currentStage !== 'prove') return false;
      if (stageFilter === 'apply' && learner.currentStage !== 'apply' && learner.currentStage !== 'match') return false;
      if (stageFilter === 'outcome' && learner.currentStage !== 'outcome') return false;

      // Track filter
      if (trackFilter !== 'all' && !learner.careerTrack.toLowerCase().includes(trackFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [learners, searchTerm, stageFilter, trackFilter]);

  const stageBadges: Record<string, { label: string; labelMr: string; color: string }> = {
    discover: { label: 'Discovering', labelMr: 'शोध टप्पा', color: 'bg-[#DCECF3] text-[#2C5E82]' },
    learn: { label: 'EarnPath', labelMr: 'शिकणे चालू', color: 'bg-[#DCECF3] text-[#2C5E82]' },
    prove: { label: 'SkillProof', labelMr: 'कौशल्य पडताळणी', color: 'bg-[#F4C84A]/30 text-[#855B00] border border-[#F4C84A]' },
    match: { label: 'Matched', labelMr: 'संधी जुळणी', color: 'bg-[#58B98C]/20 text-[#1B6644]' },
    apply: { label: 'Applying', labelMr: 'अर्ज पूर्वतयारी', color: 'bg-[#58B98C]/25 text-[#1B6644]' },
    outcome: { label: 'Outcome Secured', labelMr: 'उपजीविका सुरु', color: 'bg-[#58B98C] text-white' },
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#0A1931]">
              {language === 'mr' ? 'तुकडीतील सर्व विद्यार्थी' : 'Learners Cohort Dossier'}
            </h2>
            <p className="text-sm text-[#556987]">
              {language === 'mr'
                ? 'सातारा ग्रामीण केंद्र • एकूण २८ विद्यार्थी • प्रगती व अडचणींचे व्यवस्थापन'
                : 'Satara Rural Center • 28 Active Vocational Learners • Cohort 2026-A'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#556987]">Showing:</span>
            <span className="px-2.5 py-1 rounded-md bg-[#FAF9F4] border border-[#D9E1E5] text-xs font-bold text-[#0A1931]">
              {filteredLearners.length} / {learners.length} learners
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-4 pt-4 border-t border-[#D9E1E5]/80 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#556987] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'विद्यार्थ्याचे नाव, गाव, फोन किंवा व्यवसाय शोधा...'
                  : 'Search by learner name, village, phone, or career track...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-xs text-[#0A1931] placeholder-[#556987] focus:outline-none focus:border-[#4A7FA7]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#556987] hover:text-[#0A1931]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Track selector */}
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-xs text-[#0A1931] font-semibold focus:outline-none focus:border-[#4A7FA7]"
          >
            <option value="all">All Vocational Tracks</option>
            <option value="mobile">Mobile Device Repair</option>
            <option value="solar">Rooftop Solar</option>
            <option value="ev">Two-Wheeler EV</option>
            <option value="electrical">Domestic Electrical</option>
            <option value="retail">Retail Billing</option>
          </select>
        </div>

        {/* Quick Filter Tabs */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              stageFilter === 'all'
                ? 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5] hover:text-[#0A1931]'
            }`}
          >
            All ({learners.length})
          </button>
          <button
            onClick={() => setStageFilter('attention')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              stageFilter === 'attention'
                ? 'bg-[#EF6F61] text-white border-[#EF6F61]'
                : 'bg-[#FAF9F4] text-[#EF6F61] border-[#EF6F61]/40 hover:bg-[#EF6F61]/10'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Attention ({learners.filter((l) => l.needsAttention).length})</span>
          </button>
          <button
            onClick={() => setStageFilter('learn')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              stageFilter === 'learn'
                ? 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5] hover:text-[#0A1931]'
            }`}
          >
            In EarnPath ({learners.filter((l) => l.currentStage === 'learn').length})
          </button>
          <button
            onClick={() => setStageFilter('prove')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              stageFilter === 'prove'
                ? 'bg-[#F4C84A] text-[#0A1931] font-bold border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#855B00] border-[#F4C84A] hover:bg-[#F4C84A]/20'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>SkillProof ({learners.filter((l) => l.currentStage === 'prove').length})</span>
          </button>
          <button
            onClick={() => setStageFilter('apply')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              stageFilter === 'apply'
                ? 'bg-[#58B98C] text-white border-[#58B98C]'
                : 'bg-[#FAF9F4] text-[#1B6644] border-[#58B98C]/40 hover:bg-[#58B98C]/15'
            }`}
          >
            Placement Readiness ({learners.filter((l) => l.currentStage === 'apply' || l.currentStage === 'match').length})
          </button>
        </div>
      </div>

      {/* Learners List / Table */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl overflow-hidden shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="divide-y divide-[#D9E1E5]">
          {filteredLearners.map((learner) => {
            const stageBadge = stageBadges[learner.currentStage] || stageBadges['learn'];
            const isRavi = learner.id === 'ravi-patil-18';

            return (
              <div
                key={learner.id}
                className={`
                  p-4 md:p-5 hover:bg-[#FAF9F4] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4
                  ${learner.needsAttention ? 'bg-[#FFF9F8]' : ''}
                  ${isRavi ? 'ring-2 ring-[#4A7FA7]/20' : ''}
                `}
              >
                {/* Learner Info */}
                <div className="flex items-start gap-3.5 min-w-0 md:w-1/3">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5
                      ${
                        learner.needsAttention
                          ? 'bg-[#EF6F61]/20 text-[#C62828] border border-[#EF6F61]'
                          : isRavi
                          ? 'bg-[#0A1931] text-[#F4C84A] shadow-[2px_2px_0px_#F4C84A]'
                          : 'bg-[#DCECF3] text-[#2C5E82]'
                      }
                    `}
                  >
                    {learner.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onSelectLearner(learner.id)}
                        className="font-bold text-sm text-[#0A1931] hover:text-[#4A7FA7] hover:underline text-left cursor-pointer"
                      >
                        {language === 'mr' ? learner.nameMr : learner.name}
                      </button>
                      {isRavi && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#F4C84A] text-[#0A1931]">
                          Active Demo
                        </span>
                      )}
                      {learner.needsAttention && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#EF6F61] text-white">
                          Attention
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#556987] mt-0.5">
                      <span>Age {learner.age}</span>
                      <span>•</span>
                      <span className="truncate">{learner.education}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#556987] mt-1">
                      <MapPin className="w-3 h-3 text-[#4A7FA7] shrink-0" />
                      <span className="truncate">
                        {learner.village}, {learner.district}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Track, Stage, and Progress */}
                <div className="md:w-1/3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0A1931] truncate">
                      {language === 'mr' ? learner.careerTrackMr : learner.careerTrack}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stageBadge.color}`}>
                      {language === 'mr' ? stageBadge.labelMr : stageBadge.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          learner.overallProgress >= 80
                            ? 'bg-[#58B98C]'
                            : learner.overallProgress >= 40
                            ? 'bg-[#4A7FA7]'
                            : 'bg-[#F4C84A]'
                        }`}
                        style={{ width: `${learner.overallProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#0A1931] w-9 text-right">
                      {learner.overallProgress}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#556987]">
                    <span>
                      Week {learner.currentWeek} · {learner.completedLessonsCount}/{learner.totalLessonsCount} lessons
                    </span>
                    <span className="text-[10px]">Active {learner.lastActiveDate}</span>
                  </div>

                  {learner.needsAttention && (
                    <p className="text-[11px] font-semibold text-[#C62828] bg-[#EF6F61]/10 px-2 py-0.5 rounded">
                      ⚠️ {language === 'mr' ? learner.attentionReasonMr : learner.attentionReason}
                    </p>
                  )}
                </div>

                {/* Target Opportunity & Actions */}
                <div className="md:w-1/4 flex flex-col md:items-end justify-between gap-2.5">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-[#556987] font-semibold uppercase tracking-wider">
                      Target Opportunity
                    </p>
                    <p className="text-xs font-bold text-[#0A1931] truncate max-w-[200px]">
                      {learner.targetOpportunity || 'General Skill Building'}
                    </p>
                    <p className="text-[10px] text-[#58B98C] font-semibold truncate max-w-[200px]">
                      {learner.applicationStatus || 'In Progress'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${learner.phone}`}
                      className="p-1.5 rounded-lg border border-[#D9E1E5] bg-white text-[#4A7FA7] hover:bg-[#FAF9F4]"
                      title={`Call ${learner.name}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>

                    {learner.skillProofStatus === 'mentor_pending' && (
                      <button
                        onClick={() => onSelectReview(learner.skillProofId || 'sp-mobile-repair-01')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F4C84A] text-[#0A1931] font-bold text-xs hover:bg-[#E5B838] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Review</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectLearner(learner.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0A1931] text-[#FAF9F4] font-bold text-xs hover:bg-[#17212B] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
