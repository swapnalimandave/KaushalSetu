import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  size?: 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  size = 'lg',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    md: 'min-h-[44px] py-2.5 px-5 text-[15px]',
    lg: 'min-h-[52px] py-3.5 px-6 text-[16px]',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2.5 font-semibold font-sans
        rounded-[13px] bg-[#0A1931] text-[#FAF9F4]
        border-2 border-[#0A1931]
        shadow-[3px_3px_0px_#1A3D63]
        hover:bg-[#1A3D63] hover:border-[#1A3D63] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#0A1931]
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#0A1931]
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4A7FA7] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        transition-all duration-150 ease-out cursor-pointer select-none
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
