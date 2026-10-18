import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceButtonProps {
  onClick: () => void;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`
        relative rounded-[16px] bg-[#FFFFFF] border-2 border-[#1A3D63]/30 p-4 sm:p-4.5
        shadow-[3px_3px_0px_#DCECF3] hover:shadow-[4px_4px_0px_#4A7FA7]/40 hover:border-[#4A7FA7]
        transition-all duration-200 ${className}
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF6F61]/15 border border-[#EF6F61]/40 flex items-center justify-center text-[#EF6F61] shrink-0 mt-0.5">
            <Mic className="w-5 h-5 stroke-[2.25]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[#EF6F61]">
                Voice First
              </span>
              <span className="text-[11px] px-1.5 py-0.2 font-medium bg-[#FAF9F4] border border-[#D9E1E5] rounded text-[#64748B]">
                आवाज सहाय्यक
              </span>
            </div>
            <p className="text-[16px] font-bold text-[#0A1931] mt-0.5 font-sans">
              Prefer speaking? / बोलणे सोपे वाटते?
            </p>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Answer in Marathi, Hindi or English.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="
            inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px]
            bg-[#0A1931] hover:bg-[#1A3D63] text-[#FAF9F4] text-[14px] sm:text-[15px] font-semibold
            border border-[#0A1931] shadow-[2px_2px_0px_#EF6F61]
            hover:translate-x-[-1px] hover:translate-y-[-1px]
            active:translate-x-[1px] active:translate-y-[1px]
            focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4A7FA7]
            transition-all duration-150 cursor-pointer min-h-[44px] shrink-0
          "
        >
          <Mic className="w-4 h-4 text-[#F4C84A] animate-pulse" />
          <span>Speak to KaushalSetu</span>
        </button>
      </div>
    </div>
  );
};
