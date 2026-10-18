import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Compass } from 'lucide-react';
import { LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';

interface DiscoveryAnalysisScreenProps {
  language: LanguageCode;
  onAnalysisComplete: () => void;
}

export const DiscoveryAnalysisScreen: React.FC<DiscoveryAnalysisScreenProps> = ({
  language,
  onAnalysisComplete,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const analysisSteps = [
    { text: 'Understanding your interests', textMr: 'तुमच्या आवडी आणि कौशल्ये समजून घेत आहोत' },
    { text: 'Considering your situation', textMr: 'तुमची कौटुंबिक परिस्थिती व प्रवास मर्यादा लक्षात घेत आहोत' },
    { text: 'Looking at your current skills', textMr: 'तुमच्याकडील सध्याची कौशल्ये तपासत आहोत' },
    { text: 'Matching realistic career paths', textMr: 'स्थानिक रोजगाराशी सुसंगत करिअर मार्ग जोडत आहोत' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCompletedSteps(1), 600);
    const timer2 = setTimeout(() => setCompletedSteps(2), 1400);
    const timer3 = setTimeout(() => setCompletedSteps(3), 2200);
    const timer4 = setTimeout(() => setCompletedSteps(4), 3000);
    const timer5 = setTimeout(() => {
      onAnalysisComplete();
    }, 3900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onAnalysisComplete]);

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      <AppHeader currentLanguage={language} />

      <main className="flex-1 max-w-[680px] w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center justify-center text-center">
        {/* Animated Setu Bridge / Discovery Compass */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center shadow-[4px_4px_0px_#F4C84A]">
            <Compass className="w-10 h-10 text-[#F4C84A] animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute -inset-2 rounded-2xl border-2 border-dashed border-[#4A7FA7]/60 animate-pulse" />
        </div>

        {/* Main Title */}
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0A1931] tracking-tight font-sans">
          Finding pathways that fit you
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-2 font-devanagari">
          तुमच्यासाठी योग्य आणि व्यावहारिक मार्ग शोधत आहोत...
        </p>

        {/* Progressive Checklist */}
        <div className="w-full mt-8 p-5 sm:p-6 rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] text-left">
          <div className="space-y-4">
            {analysisSteps.map((step, index) => {
              const isDone = completedSteps > index;
              const isCurrent = completedSteps === index;

              return (
                <div
                  key={step.text}
                  className={`
                    flex items-center gap-3.5 transition-all duration-300
                    ${isDone ? 'opacity-100' : isCurrent ? 'opacity-90 scale-[1.01]' : 'opacity-40'}
                  `}
                >
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors
                      ${
                        isDone
                          ? 'bg-[#58B98C] text-white ring-2 ring-[#58B98C]/30'
                          : isCurrent
                          ? 'bg-[#0A1931] text-[#F4C84A] animate-pulse'
                          : 'border-2 border-[#D9E1E5] text-transparent'
                      }
                    `}
                  >
                    <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[15px] sm:text-[16px] font-bold text-[#0A1931]">
                      {step.text}
                    </span>
                    <span className="text-[12px] text-[#64748B] font-devanagari">
                      {step.textMr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#D9E1E5] flex items-center justify-between text-xs text-[#64748B]">
            <span>Local market demand analyzed</span>
            <span className="font-mono font-bold text-[#0A1931]">Step 4 / 4</span>
          </div>
        </div>
      </main>
    </div>
  );
};
