import React from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  Briefcase,
  FileBarChart2,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { FacilitatorSection, LanguageCode } from '../../types';
import { FACILITATOR_PROFILE_INFO } from '../../data/facilitatorData';

interface FacilitatorSidebarProps {
  currentSection: FacilitatorSection;
  onSelectSection: (section: FacilitatorSection) => void;
  onSwitchToStudentView: () => void;
  pendingReviewsCount: number;
  needsAttentionCount: number;
  language: LanguageCode;
  onLanguageChangeRequest: () => void;
}

export const FacilitatorSidebar: React.FC<FacilitatorSidebarProps> = ({
  currentSection,
  onSelectSection,
  onSwitchToStudentView,
  pendingReviewsCount,
  needsAttentionCount,
  language,
  onLanguageChangeRequest,
}) => {
  const navItems = [
    {
      id: 'overview' as FacilitatorSection,
      label: 'Overview',
      labelMr: 'डॅशबोर्ड सारांश',
      icon: LayoutDashboard,
      badge: needsAttentionCount > 0 ? `${needsAttentionCount} alerts` : undefined,
      badgeColor: 'bg-[#EF6F61] text-white',
    },
    {
      id: 'learners' as FacilitatorSection,
      label: 'Learners',
      labelMr: 'प्रशिक्षणार्थी यादी',
      icon: Users,
      badge: '28',
      badgeColor: 'bg-[#D9E1E5] text-[#0A1931]',
    },
    {
      id: 'skillproof' as FacilitatorSection,
      label: 'Skill Verification',
      labelMr: 'कौशल्य पडताळणी',
      icon: Award,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} pending` : undefined,
      badgeColor: 'bg-[#F4C84A] text-[#0A1931] font-bold',
    },
    {
      id: 'opportunities' as FacilitatorSection,
      label: 'Opportunities',
      labelMr: 'रोजगार संधी व अर्ज',
      icon: Briefcase,
      badge: '4 active',
      badgeColor: 'bg-[#58B98C]/20 text-[#1B6644]',
    },
    {
      id: 'reports' as FacilitatorSection,
      label: 'Reports & Impact',
      labelMr: 'अहवाल व प्रगती',
      icon: FileBarChart2,
    },
  ];

  return (
    <aside className="w-64 bg-[#FAF9F4] border-r border-[#D9E1E5] flex flex-col h-screen sticky top-0 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#D9E1E5] bg-[#FFFFFF]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A1931] flex items-center justify-center text-[#F4C84A] shadow-[2px_2px_0px_#F4C84A]">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-[18px] tracking-tight text-[#0A1931]">
                Kaushal<span className="text-[#4A7FA7]">Setu</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0A1931] text-[#F4C84A]">
                FACILITATOR
              </span>
            </div>
            <p className="text-[11px] font-devanagari text-[#4A7FA7] font-medium leading-none mt-0.5">
              कौशल्याकडून उपजीविकेकडे
            </p>
          </div>
        </div>

        {/* Facilitator identity card */}
        <div className="mt-4 p-2.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A7FA7] text-white flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0A1931] truncate">
                {language === 'mr' ? FACILITATOR_PROFILE_INFO.nameMr : FACILITATOR_PROFILE_INFO.name}
              </p>
              <p className="text-[10px] text-[#4A7FA7] truncate font-medium">
                {language === 'mr' ? 'वरिष्ठ समन्वयक' : 'Training Facilitator'}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#D9E1E5]/60 flex items-center justify-between text-[10px] text-[#556987]">
            <span className="truncate">Satara Rural Center</span>
            <span className="inline-flex items-center gap-1 text-[#58B98C] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58B98C]"></span>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#556987]">
          {language === 'mr' ? 'व्यवस्थापन विभाग' : 'Operations Menu'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentSection === item.id ||
            (item.id === 'learners' && currentSection === 'learner_detail') ||
            (item.id === 'skillproof' && currentSection === 'review_detail');

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-semibold transition-all
                ${
                  isActive
                    ? 'bg-[#0A1931] text-[#FAF9F4] shadow-[2px_2px_0px_#F4C84A]'
                    : 'text-[#17212B] hover:bg-[#FFFFFF] hover:text-[#0A1931]'
                }
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#F4C84A]' : 'text-[#4A7FA7]'
                  }`}
                />
                <span className="truncate font-sans">
                  {language === 'mr' ? item.labelMr : item.label}
                </span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Role switch */}
      <div className="p-3 border-t border-[#D9E1E5] bg-[#FFFFFF]/60 space-y-2">
        <button
          onClick={onLanguageChangeRequest}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold text-[#0A1931] bg-[#FAF9F4] border border-[#D9E1E5] hover:border-[#4A7FA7]"
        >
          <span className="text-[#556987]">{language === 'mr' ? 'भाषा' : 'Language'}:</span>
          <span className="font-devanagari font-bold text-[#4A7FA7]">
            {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
          </span>
        </button>

        <button
          onClick={onSwitchToStudentView}
          className="
            w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
            bg-[#FAF9F4] border-2 border-[#0A1931] text-[#0A1931] text-xs font-bold
            hover:bg-[#F4C84A] hover:border-[#0A1931] shadow-[2px_2px_0px_#0A1931]
            transition-all active:translate-y-0.5 cursor-pointer
          "
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'विद्यार्थी डॅशबोर्डवर जा' : 'Switch to Student View'}</span>
        </button>

        <p className="text-[10px] text-center text-[#556987] pt-1">
          KaushalSetu Operational Desk v1.4
        </p>
      </div>
    </aside>
  );
};
