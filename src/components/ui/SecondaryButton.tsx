import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'lg',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'min-h-[36px] py-1.5 px-3.5 text-[13px]',
    md: 'min-h-[44px] py-2.5 px-5 text-[15px]',
    lg: 'min-h-[50px] py-3 px-6 text-[16px]',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2.5 font-semibold font-sans
        rounded-[13px] bg-[#FFFFFF] text-[#0A1931]
        border border-[#D9E1E5]
        shadow-[2px_2px_0px_rgba(10,25,49,0.06)]
        hover:bg-[#FAF9F4] hover:border-[#1A3D63] hover:text-[#0A1931]
        active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
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
