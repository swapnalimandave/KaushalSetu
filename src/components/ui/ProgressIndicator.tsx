import React from 'react';

interface ProgressStep {
  id: string;
  label: string;
  sublabel?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStepIndex: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStepIndex,
  className = '',
}) => {
  return (
    <div className={`w-full py-2 ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[2px] bg-[#D9E1E5] -z-0" />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                  transition-all duration-200 border-2
                  ${
                    isCurrent
                      ? 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931] shadow-[2px_2px_0px_#F4C84A]'
                      : isCompleted
                      ? 'bg-[#58B98C] text-white border-[#58B98C]'
                      : 'bg-[#FFFFFF] text-[#64748B] border-[#D9E1E5]'
                  }
                `}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={`
                  text-[12px] font-semibold mt-1.5 whitespace-nowrap
                  ${isCurrent ? 'text-[#0A1931]' : isCompleted ? 'text-[#17212B]' : 'text-[#64748B]'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
