import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantStyles = {
    primary: 'bg-[#58CC02] hover:bg-[#46A302] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-[#1CB0F6] hover:bg-[#1899D6] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
    accent: 'bg-[#FF9600] hover:bg-[#E68600] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
    outline: 'border-2 border-[#E5E5E5] hover:border-[#1CB0F6] text-[#3C3C3C] hover:bg-[#F7F7F7]',
    ghost: 'text-[#777777] hover:text-[#3C3C3C] hover:bg-[#F7F7F7]',
  };

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm gap-1.5',
    md: 'py-3 px-6 text-base gap-2',
    lg: 'py-4 px-8 text-lg gap-2.5',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
