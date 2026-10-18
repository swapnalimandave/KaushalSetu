import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Building2,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  LanguageCode,
  Opportunity,
  ApplicationPreparation,
  OpportunityType,
} from '../types';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import {
  getStoredOpportunities,
  toggleOpportunitySaved,
  getStoredApplication,
  toggleApplicationStep,
  markApplicationSubmitted,
} from '../utils/opportunityManager';

interface OpportunitiesScreenProps {
  language: LanguageCode;
  onBackToHome: () => void;
  onBackToEarnPath: () => void;
  onOpenProfileSkills: () => void;
  onOpenFacilitatorPortal?: () => void;
  onLanguageChangeRequest: () => void;
}

export const OpportunitiesScreen: React.FC<OpportunitiesScreenProps> = ({
  language,
  onBackToHome,
  onBackToEarnPath,
  onOpenProfileSkills,
  onOpenFacilitatorPortal,
  onLanguageChangeRequest,
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(getStoredOpportunities());
  const [application, setApplication] = useState<ApplicationPreparation>(getStoredApplication());
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(opportunities[0] || null);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'apprenticeship' | 'govt' | 'saved'>('all');

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleOpportunitySaved(id);
    setOpportunities(updated);
    if (selectedOpportunity?.id === id) {
      const match = updated.find((o) => o.id === id);
      if (match) setSelectedOpportunity(match);
    }
  };

  const handleToggleStep = (stepId: string) => {
    const updated = toggleApplicationStep(stepId);
    setApplication(updated);
  };

  const handleMarkSubmitted = () => {
    const updated = markApplicationSubmitted();
    setApplication(updated);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTabFilter === 'saved') return opp.saved;
    if (activeTabFilter === 'apprenticeship') return opp.type === 'Apprenticeship';
    if (activeTabFilter === 'govt') return opp.type === 'Govt Training';
    return true;
  });

  const completedStepsCount = application.steps.filter((s) => s.done).length;
  const isAppReady = completedStepsCount === application.steps.length;

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30 pb-24">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
        onOpenFacilitatorPortal={onOpenFacilitatorPortal}
      />

      <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'mr' ? 'मुख्य पृष्ठावर परत' : 'Back to Home'}</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#64748B]">
            Satara District Matcher
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-6 sm:p-7 mb-6">
          <div className="absolute -top-3.5 right-6">
            <AnnotationTag variant="sticky" rotation={1}>
              {language === 'mr' ? 'स्थानिक संधी जुळणी 💼' : 'Verified Local Matches 💼'}
            </AnnotationTag>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <Briefcase className="w-5 h-5 text-[#4A7FA7]" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Opportunity Matcher
            </span>
          </div>

          <h1 className="text-[24px] sm:text-[30px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            {language === 'mr' ? 'स्थानिक रोजगार व शिकाऊ संधी' : 'Local Opportunities & Apprenticeships'}
          </h1>

          <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-1.5 font-devanagari leading-relaxed">
            {language === 'mr'
              ? 'तुमच्या "मोबाईल प्राथमिक तपासणी" प्रमाणित कौशल्याशी जुळणाऱ्या सातारा परिसरातील पडताळणी झालेल्या कार्यशाळा.'
              : 'Verified workshops and skill programs in Satara district matching your verified diagnostic skill badge.'}
          </p>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#D9E1E5]">
            <button
              type="button"
              onClick={() => setActiveTabFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTabFilter === 'all'
                  ? 'bg-[#0A1931] text-[#FAF9F4] shadow-[2px_2px_0px_#F4C84A]'
                  : 'bg-[#FAF9F4] text-[#64748B] border border-[#D9E1E5]'
              }`}
            >
              All Matches (4)
            </button>
            <button
              type="button"
              onClick={() => setActiveTabFilter('apprenticeship')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTabFilter === 'apprenticeship'
                  ? 'bg-[#0A1931] text-[#FAF9F4] shadow-[2px_2px_0px_#F4C84A]'
                  : 'bg-[#FAF9F4] text-[#64748B] border border-[#D9E1E5]'
              }`}
            >
              Apprenticeships
            </button>
            <button
              type="button"
              onClick={() => setActiveTabFilter('govt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTabFilter === 'govt'
                  ? 'bg-[#0A1931] text-[#FAF9F4] shadow-[2px_2px_0px_#F4C84A]'
                  : 'bg-[#FAF9F4] text-[#64748B] border border-[#D9E1E5]'
              }`}
            >
              Govt Stipend Batches
            </button>
            <button
              type="button"
              onClick={() => setActiveTabFilter('saved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTabFilter === 'saved'
                  ? 'bg-[#0A1931] text-[#FAF9F4] shadow-[2px_2px_0px_#F4C84A]'
                  : 'bg-[#FAF9F4] text-[#64748B] border border-[#D9E1E5]'
              }`}
            >
              Saved ({opportunities.filter((o) => o.saved).length})
            </button>
          </div>
        </div>

        {/* Content Layout: 2 Columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Opportunities Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredOpportunities.length === 0 ? (
              <div className="p-8 rounded-[20px] bg-[#FFFFFF] border-2 border-[#D9E1E5] text-center">
                <p className="text-sm font-bold text-[#64748B]">No opportunities match this filter.</p>
                <button
                  type="button"
                  onClick={() => setActiveTabFilter('all')}
                  className="mt-2 text-xs font-bold text-[#4A7FA7] underline cursor-pointer"
                >
                  View all opportunities
                </button>
              </div>
            ) : (
              filteredOpportunities.map((opp) => {
                const isSelected = selectedOpportunity?.id === opp.id;
                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpportunity(opp)}
                    className={`
                      p-5 rounded-[20px] bg-[#FFFFFF] border-2 transition-all cursor-pointer relative
                      ${
                        isSelected
                          ? 'border-[#0A1931] shadow-[4px_4px_0px_#0A1931]'
                          : 'border-[#D9E1E5] hover:border-[#0A1931] shadow-[2px_2px_0px_rgba(0,0,0,0.03)]'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`
                              text-[10px] font-bold px-2 py-0.5 rounded-full
                              ${
                                opp.matchLevel === 'Strong Match'
                                  ? 'bg-[#E8F5E9] text-[#1E6B52]'
                                  : 'bg-[#DCECF3] text-[#0A1931]'
                              }
                            `}
                          >
                            {opp.matchLevel}
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            {opp.distanceKm} km · {opp.locationType}
                          </span>
                        </div>

                        <h2 className="text-[17px] font-extrabold text-[#0A1931] font-sans">
                          {language === 'mr' ? opp.titleMr : opp.title}
                        </h2>
                        <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-[#4A7FA7]" />
                          <span>{opp.provider}</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(opp.id, e)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0A1931] hover:bg-[#FAF9F4] cursor-pointer"
                        title={opp.saved ? 'Remove bookmark' : 'Save opportunity'}
                      >
                        {opp.saved ? (
                          <BookmarkCheck className="w-5 h-5 text-[#EF6F61] fill-[#EF6F61]" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="my-2.5 p-3 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]/60 text-xs text-[#17212B] leading-relaxed font-devanagari">
                      <strong>{language === 'mr' ? 'का जुळते:' : 'Why fits:'}</strong>{' '}
                      {language === 'mr' ? opp.whyFitsMr : opp.whyFits}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-[#D9E1E5]">
                      <span className="text-[#1E6B52]">{opp.stipendOrSalary}</span>
                      <span className="text-[#4A7FA7] flex items-center">
                        {language === 'mr' ? 'तपशील व अर्ज' : 'View Details'} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Opportunity Detail & Application Preparation (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {selectedOpportunity && (
              <div className="p-6 rounded-[22px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] sticky top-20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">
                    Opportunity Details
                  </span>
                  <span className="text-xs font-bold text-[#1E6B52] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Partner</span>
                  </span>
                </div>

                <h3 className="text-[20px] font-extrabold text-[#0A1931] font-sans">
                  {selectedOpportunity.title}
                </h3>
                <span className="text-xs text-[#64748B] block mt-0.5">
                  {selectedOpportunity.provider} · {selectedOpportunity.location}
                </span>

                <div className="my-3.5 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
                  <div className="text-xs font-bold text-[#1A3D63] mb-1">Stipend & Duration</div>
                  <div className="text-[14px] font-extrabold text-[#1E6B52]">
                    {selectedOpportunity.stipendOrSalary}
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    {selectedOpportunity.duration}
                  </div>
                </div>

                {/* Eligibility Checklist */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3D63] mb-2">
                    Eligibility Check
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#17212B]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1E6B52] shrink-0" />
                      <span>Education: Class 10 passed (Ravi is eligible)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1E6B52] shrink-0" />
                      <span>Skill Badge: Basic Mobile Device Diagnosis (Verified)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1E6B52] shrink-0" />
                      <span>Travel: Nearby Satara town (Within daily bus travel)</span>
                    </li>
                  </ul>
                </div>

                {/* Application Preparation Checklist */}
                <div className="pt-4 border-t border-[#D9E1E5] mb-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3D63]">
                      Application Checklist
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#DCECF3] text-[#0A1931]">
                      {completedStepsCount} of {application.steps.length} Ready
                    </span>
                  </div>

                  <div className="space-y-2">
                    {application.steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleToggleStep(step.id)}
                        className={`
                          w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-colors cursor-pointer
                          ${
                            step.done
                              ? 'bg-[#E8F5E9]/50 border-[#1E6B52]/40 text-[#17212B]'
                              : 'bg-[#FAF9F4] border-[#EF6F61]/50 text-[#17212B]'
                          }
                        `}
                      >
                        <div
                          className={`
                            w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5
                            ${
                              step.done
                                ? 'bg-[#1E6B52] border-[#1E6B52] text-white'
                                : 'border-[#EF6F61] bg-white'
                            }
                          `}
                        >
                          {step.done && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <span className={`block font-semibold ${step.done ? 'line-through text-[#64748B]' : 'text-[#0A1931]'}`}>
                            {language === 'mr' ? step.labelMr : step.label}
                          </span>
                          {step.helpText && (
                            <span className="text-[10px] text-[#64748B] block mt-0.5">
                              {step.helpText}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                {isAppReady ? (
                  <PrimaryButton fullWidth size="md" onClick={handleMarkSubmitted}>
                    Application Ready · Visit Workshop
                  </PrimaryButton>
                ) : (
                  <PrimaryButton fullWidth size="md" onClick={() => handleToggleStep('step-photo')}>
                    Mark Missing Photo as Ready
                  </PrimaryButton>
                )}

                <p className="text-[11px] text-[#64748B] text-center mt-2">
                  No automated application spam. You carry your verified credential directly to the shop.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation
        activeTab="opportunities"
        language={language}
        onTabChange={(tab) => {
          if (tab === 'home') onBackToHome();
          if (tab === 'learn') onBackToEarnPath();
          if (tab === 'profile') onOpenProfileSkills();
        }}
      />
    </div>
  );
};
