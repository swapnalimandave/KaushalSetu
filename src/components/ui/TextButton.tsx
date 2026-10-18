import React from 'react';

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'subtle' | 'navy' | 'coral';
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  variant = 'subtle',
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    subtle: 'text-[#64748B] hover:text-[#0A1931] hover:underline decoration-1 underline-offset-4',
    navy: 'text-[#0A1931] hover:text-[#1A3D63] font-semibold hover:underline decoration-2 underline-offset-4',
    coral: 'text-[#EF6F61] hover:text-[#C62828] font-semibold hover:underline decoration-1 underline-offset-4',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 text-[14px] sm:text-[15px]
        rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7FA7]
        transition-colors duration-150 cursor-pointer select-none
        ${variantStyles[variant]}
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
