import React from 'react';
import { Check, ChevronRight, Compass, BookOpen, Award, Briefcase, FileCheck, Flag } from 'lucide-react';
import { LivelihoodStage, LanguageCode } from '../../types';

interface LivelihoodJourneyWidgetProps {
  stages: LivelihoodStage[];
  language: LanguageCode;
  onOpenFullJourney: () => void;
  onSelectStage?: (stage: LivelihoodStage) => void;
}

export const LivelihoodJourneyWidget: React.FC<LivelihoodJourneyWidgetProps> = ({
  stages,
  language,
  onOpenFullJourney,
  onSelectStage,
}) => {
  const getStageIcon = (id: string) => {
    switch (id) {
      case 'discover':
        return Compass;
      case 'learn':
        return BookOpen;
      case 'prove':
        return Award;
      case 'match':
        return Briefcase;
      case 'apply':
        return FileCheck;
      case 'outcome':
      default:
        return Flag;
    }
  };

  return (
    <div className="rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7] block">
            {language === 'mr' ? 'कौशल्य ते उपजीविका' : language === 'hi' ? 'कौशल से आजीविका' : 'Pathway Tracker'}
          </span>
          <h3 className="text-[17px] sm:text-[19px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            {language === 'mr' ? 'उपजीविकेचा प्रवास' : language === 'hi' ? 'आजीविका की यात्रा' : 'Livelihood Journey'}
          </h3>
        </div>

        <button
          type="button"
          onClick={onOpenFullJourney}
          className="inline-flex items-center gap-1 text-[13px] font-bold text-[#1A3D63] hover:text-[#4A7FA7] p-1.5 rounded-lg hover:bg-[#DCECF3]/50 transition-colors cursor-pointer"
        >
          <span>{language === 'mr' ? 'संपूर्ण प्रवास पहा' : 'View Full Journey'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[13px] text-[#64748B] mb-5 leading-relaxed">
        {language === 'mr'
          ? 'प्रत्येक टप्पा तुम्हाला स्थानिक रोजगाराच्या दिशेने पुढे नेतो. आम्ही कोणतेही खोटे दावे करत नाही.'
          : 'Every stage moves you toward practical livelihood. Clear, honest progress tracking.'}
      </p>

      {/* 6-Stage Progress Pipeline */}
      <div className="relative">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {stages.map((stage, idx) => {
            const Icon = getStageIcon(stage.id);
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage ? onSelectStage(stage) : onOpenFullJourney()}
                className={`
                  relative text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[92px]
                  ${
                    isCurrent
                      ? 'bg-[#FAF9F4] border-[#0A1931] shadow-[2px_2px_0px_#0A1931]'
                      : isCompleted
                      ? 'bg-[#FFFFFF] border-[#1E6B52]/40 hover:border-[#1E6B52]'
                      : 'bg-[#FAF9F4]/60 border-[#D9E1E5] text-[#94A3B8]'
                  }
                `}
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#64748B]">
                    0{stage.order}
                  </span>

                  <div
                    className={`
                      w-5 h-5 rounded-md flex items-center justify-center text-xs
                      ${
                        isCompleted
                          ? 'bg-[#E8F5E9] text-[#1E6B52]'
                          : isCurrent
                          ? 'bg-[#DCECF3] text-[#0A1931]'
                          : 'bg-[#FAF9F4] text-[#94A3B8] border border-[#D9E1E5]'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Icon className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </div>
                </div>

                {/* Step label */}
                <div>
                  <span
                    className={`
                      text-[12px] font-bold block leading-snug
                      ${isCurrent ? 'text-[#0A1931]' : isCompleted ? 'text-[#1E6B52]' : 'text-[#64748B]'}
                    `}
                  >
                    {language === 'mr' ? stage.labelMr.split(' ')[0] : stage.label}
                  </span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5 truncate">
                    {isCompleted ? '✓ Done' : isCurrent ? '● Current' : 'Upcoming'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
