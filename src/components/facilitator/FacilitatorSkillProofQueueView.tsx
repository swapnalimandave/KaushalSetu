import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  Mic,
  FileText,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  User,
  ExternalLink,
} from 'lucide-react';
import { ReviewQueueItem } from '../../utils/facilitatorManager';
import { LanguageCode } from '../../types';

interface FacilitatorSkillProofQueueViewProps {
  queue: ReviewQueueItem[];
  language: LanguageCode;
  onSelectReview: (reviewId: string) => void;
  onSelectLearner: (learnerId: string) => void;
}

export const FacilitatorSkillProofQueueView: React.FC<FacilitatorSkillProofQueueViewProps> = ({
  queue,
  language,
  onSelectReview,
  onSelectLearner,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('pending');

  const filteredItems = queue.filter((item) => {
    if (filter === 'pending') return item.needsReviewAction;
    if (filter === 'verified') return item.status === 'verified';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D97706]" />
              <h2 className="text-xl font-bold font-serif text-[#0A1931]">
                {language === 'mr' ? 'कौशल्य पडताळणी रांग' : 'SkillProof Practical Review Queue'}
              </h2>
            </div>
            <p className="text-sm text-[#556987] mt-0.5">
              {language === 'mr'
                ? 'कृत्रिम बुद्धिमत्ता (AI) केवळ प्राथमिक छाननी करते. अंतिम पडताळणी व प्रमाणपत्र मान्यता मेंटॉरने द्यायची आहे.'
                : 'AI provides preliminary rubric screening only. Facilitators & master trainers make the final verification.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filter === 'pending'
                  ? 'bg-[#F4C84A] text-[#0A1931] font-bold border-[#0A1931]'
                  : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5]'
              }`}
            >
              Pending ({queue.filter((q) => q.needsReviewAction).length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filter === 'verified'
                  ? 'bg-[#58B98C] text-white font-bold border-[#58B98C]'
                  : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5]'
              }`}
            >
              Verified ({queue.filter((q) => q.status === 'verified').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#0A1931] text-[#FAF9F4] font-bold border-[#0A1931]'
                  : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5]'
              }`}
            >
              All Submissions ({queue.length})
            </button>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isPending = item.needsReviewAction;
          const isVerified = item.status === 'verified';

          return (
            <div
              key={item.id}
              className={`
                bg-[#FFFFFF] border-2 rounded-xl p-5 shadow-[2px_2px_0px_rgba(10,25,49,0.04)] transition-all
                ${isPending ? 'border-[#F4C84A]' : 'border-[#D9E1E5]'}
              `}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side: Student & Project */}
                <div className="space-y-2 lg:max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isPending
                          ? 'bg-[#F4C84A] text-[#0A1931]'
                          : isVerified
                          ? 'bg-[#58B98C]/20 text-[#1B6644]'
                          : 'bg-[#DCECF3] text-[#2C5E82]'
                      }`}
                    >
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>

                    <span className="text-xs text-[#556987] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Submitted: {item.submittedAt}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectLearner(item.learnerId)}
                        className="text-base font-bold text-[#0A1931] hover:text-[#4A7FA7] hover:underline"
                      >
                        {language === 'mr' ? item.learnerNameMr : item.learnerName}
                      </button>
                      <span className="text-xs text-[#556987]">
                        · {language === 'mr' ? item.pathwayTitleMr : item.pathwayTitle}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#4A7FA7] mt-0.5">
                      {language === 'mr' ? item.skillTitleMr : item.skillTitle}
                    </h3>
                  </div>

                  {/* Evidence chips */}
                  <div className="flex items-center gap-2 text-xs text-[#556987] pt-1">
                    {item.evidencePhotoCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF9F4] border border-[#D9E1E5]">
                        <Camera className="w-3.5 h-3.5 text-[#4A7FA7]" />
                        <span>Bench Photo Uploaded</span>
                      </span>
                    )}
                    {item.hasAudio && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF9F4] border border-[#D9E1E5]">
                        <Mic className="w-3.5 h-3.5 text-[#EF6F61]" />
                        <span>Marathi Audio Note (42s)</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#DCECF3] text-[#2C5E82]">
                      <Sparkles className="w-3.5 h-3.5 text-[#2C5E82]" />
                      <span>AI Rubric Screened</span>
                    </span>
                  </div>
                </div>

                {/* Right side: AI Insight & Action */}
                <div className="lg:w-80 space-y-3 shrink-0">
                  <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-xs space-y-1">
                    <p className="font-bold text-[#4A7FA7] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#2C5E82]" />
                      <span>AI Preliminary Observation:</span>
                    </p>
                    <p className="text-[#17212B]">{item.aiSummaryBadge}</p>
                  </div>

                  <button
                    onClick={() => onSelectReview(item.id)}
                    className="w-full py-2.5 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F4C84A]" />
                    <span>
                      {isVerified
                        ? 'View Verification Record'
                        : language === 'mr'
                        ? 'मूल्यमापन व स्वाक्षरी करा'
                        : 'Evaluate & Sign Off'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
