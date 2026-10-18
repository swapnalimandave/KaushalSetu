import React from 'react';
import { X, Check, Clock, Wrench, Wifi, MapPin, ShieldCheck } from 'lucide-react';
import { CareerOption, LanguageCode } from '../types';
import { SecondaryButton } from './ui/SecondaryButton';

interface ComparePathsModalProps {
  careers: CareerOption[];
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const ComparePathsModal: React.FC<ComparePathsModalProps> = ({
  careers,
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  // Comparison metrics mapping
  const comparisonData = careers.slice(0, 3).map((c) => {
    let practicalLevel = 'High (80% Hands-on)';
    let internetNeed = 'Low (Offline packs)';
    let travelLevel = 'Nearby town';

    if (c.id === 'digital-services') {
      practicalLevel = 'Moderate (Form workflows)';
      internetNeed = 'Moderate to high (Portal submissions)';
      travelLevel = 'Village or Gram Panchayat';
    } else if (c.id === 'solar-technician') {
      practicalLevel = 'High (Wiring & mechanical)';
      internetNeed = 'Very low';
      travelLevel = 'District & farm sites';
    }

    return {
      career: c,
      title: language === 'mr' ? c.titleMr : language === 'hi' ? c.titleHi : c.title,
      englishTitle: c.title,
      learningDuration: `${c.trainingDurationWeeks} weeks short module`,
      practicalWorkLevel: practicalLevel,
      internetDependence: internetNeed,
      travelRequirement: travelLevel,
      currentReadiness: c.currentReadiness,
      matchScore: c.matchScore,
    };
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-paths-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className="
          relative w-full max-w-2xl bg-[#FAF9F4] rounded-t-[24px] sm:rounded-[20px]
          border-t-2 sm:border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
          p-5 sm:p-7 z-10 max-h-[92vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div>
            <h3 id="compare-paths-title" className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] font-sans">
              Compare Career Paths · पर्यायांची तुलना
            </h3>
            <p className="text-[13px] text-[#64748B]">
              Side-by-side view tailored to your situation & constraints
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] hover:bg-[#DCECF3]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile & Tablet Friendly Stacked Cards Layout */}
        <div className="mt-5 space-y-4">
          {comparisonData.map((item, index) => (
            <div
              key={item.career.id}
              className={`
                p-4 sm:p-5 rounded-[18px] border bg-[#FFFFFF] transition-all
                ${index === 0 ? 'border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931]' : 'border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.04)]'}
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A1931] text-[#FAF9F4] px-2 py-0.5 rounded">
                        Best Match
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-[#4A7FA7]">
                      {item.matchScore}% Compatibility
                    </span>
                  </div>
                  <h4 className="text-[17px] font-bold text-[#0A1931] mt-1 font-devanagari">
                    {item.title}
                  </h4>
                  <span className="text-xs text-[#64748B]">{item.englishTitle}</span>
                </div>
              </div>

              {/* 5 specific comparison rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px] pt-3 border-t border-[#D9E1E5]/70">
                <div className="p-2.5 rounded-lg bg-[#FAF9F4] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4A7FA7] shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#64748B] block">Learning Duration</span>
                    <span className="font-semibold text-[#0A1931]">{item.learningDuration}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F4] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#58B98C] shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#64748B] block">Practical Work Level</span>
                    <span className="font-semibold text-[#0A1931]">{item.practicalWorkLevel}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F4] flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#EF6F61] shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#64748B] block">Internet Dependence</span>
                    <span className="font-semibold text-[#0A1931]">{item.internetDependence}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F4] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0A1931] shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#64748B] block">Travel Requirement</span>
                    <span className="font-semibold text-[#0A1931]">{item.travelRequirement}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-lg bg-[#DCECF3]/60 flex items-center gap-2 text-[12px] text-[#1A3D63]">
                <ShieldCheck className="w-4 h-4 text-[#4A7FA7] shrink-0" />
                <span><strong>Readiness:</strong> {item.currentReadiness}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-[#D9E1E5] flex justify-end">
          <SecondaryButton size="md" fullWidth onClick={onClose}>
            Back to Recommendations
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
