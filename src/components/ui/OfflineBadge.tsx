import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';

interface OfflineBadgeProps {
  label?: string;
  className?: string;
  variant?: 'compact' | 'detailed';
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({
  label = 'Works Offline',
  className = '',
  variant = 'compact',
}) => {
  if (variant === 'detailed') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[13px] text-[#17212B] shadow-[1px_1px_0px_rgba(10,25,49,0.06)] ${className}`}
      >
        <div className="w-2 h-2 rounded-full bg-[#58B98C] ring-2 ring-[#58B98C]/30 animate-pulse" />
        <span className="font-semibold">{label}</span>
        <span className="text-[#64748B] text-xs">· Low-data verified</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9F4] border border-[#D9E1E5] text-[12px] font-semibold text-[#1A3D63] select-none ${className}`}
      title="Designed for 2G/3G connections and offline study"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#4A7FA7]" />
      <span>{label}</span>
    </div>
  );
};
