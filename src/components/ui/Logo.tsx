import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Abstract bridge + stepping pathway SVG symbol */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl bg-[#0A1931] p-1.5 flex items-center justify-center text-white shadow-sm ring-1 ring-[#0A1931]/10`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Bridge arch foundation */}
          <path
            d="M4 23C7 16 11 13 16 13C21 13 25 16 28 23"
            stroke="#FAF9F4"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          {/* Pathway deck across the bridge */}
          <path
            d="M3 24H29"
            stroke="#DCECF3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
          {/* Rising forward step / progress arc */}
          <path
            d="M9 13C12 7.5 16 5 21 5"
            stroke="#F4C84A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Forward beacon / rising sun / destination node */}
          <circle cx="23" cy="5" r="2.2" fill="#EF6F61" />
          {/* Stepping foundation points */}
          <circle cx="8" cy="20" r="1.3" fill="#FAF9F4" />
          <circle cx="16" cy="17" r="1.3" fill="#58B98C" />
          <circle cx="24" cy="20" r="1.3" fill="#FAF9F4" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-[#0A1931] font-sans leading-none ${titleSizes[size]}`}
        >
          Kaushal<span className="text-[#4A7FA7]">Setu</span>
        </span>
        {showTagline && (
          <span className="text-[11px] sm:text-[12px] font-medium text-[#64748B] tracking-normal mt-1 font-devanagari">
            शिक्षा से कौशल · कौशल से रोज़गार
          </span>
        )}
      </div>
    </div>
  );
};
