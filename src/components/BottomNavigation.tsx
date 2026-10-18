import React from 'react';
import { Home, BookOpen, Briefcase, Award } from 'lucide-react';

import { LanguageCode } from '../types';

export type NavTab = 'home' | 'learn' | 'opportunities' | 'profile' | 'discover' | 'prove' | 'earn';

interface BottomNavigationProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  language?: LanguageCode;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabChange,
  language = 'en',
  className = '',
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      matchIds: ['home', 'discover'],
      label: 'Home',
      labelMr: 'मुख्य',
      labelHi: 'होम',
      icon: Home,
    },
    {
      id: 'learn' as NavTab,
      matchIds: ['learn'],
      label: 'Learn',
      labelMr: 'शिका',
      labelHi: 'सीखें',
      icon: BookOpen,
    },
    {
      id: 'opportunities' as NavTab,
      matchIds: ['opportunities', 'earn'],
      label: 'Opportunities',
      labelMr: 'संधी',
      labelHi: 'अवसर',
      icon: Briefcase,
    },
    {
      id: 'profile' as NavTab,
      matchIds: ['profile', 'prove'],
      label: 'Skills',
      labelMr: 'कौशल्ये',
      labelHi: 'कौशल',
      icon: Award,
    },
  ];

  return (
    <nav
      aria-label="Student primary navigation"
      className={`
        sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md
        border-t border-[#D9E1E5] px-2 py-1 safe-area-inset-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.03)]
        ${className}
      `}
    >
      <div className="grid grid-cols-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.matchIds ? tab.matchIds.includes(activeTab) : activeTab === tab.id;
          const displayLabel =
            language === 'mr' ? tab.labelMr : language === 'hi' ? tab.labelHi : tab.label;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-lg
                transition-all duration-150 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7FA7]
                ${
                  isActive
                    ? 'text-[#0A1931] font-bold'
                    : 'text-[#64748B] hover:text-[#0A1931]'
                }
              `}
            >
              <div
                className={`
                  p-1 rounded-md transition-colors
                  ${isActive ? 'bg-[#DCECF3] text-[#0A1931]' : ''}
                `}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className={`text-[11px] leading-tight mt-0.5 ${language !== 'en' ? 'font-devanagari font-bold' : 'font-sans'}`}>
                {displayLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
