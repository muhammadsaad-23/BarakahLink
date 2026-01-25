
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.15em] rounded-2xl transition-all duration-300 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed transform';
  
  const variants = {
    primary: 'btn-shimmer bg-gradient-to-br from-[#064e3b] to-[#022c22] text-[#fbbf24] shadow-[0_10px_30px_-10px_rgba(6,78,59,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(6,78,59,0.6)] hover:-translate-y-1 border-b-4 border-[#011a14]',
    secondary: 'bg-gradient-to-br from-[#d97706] to-[#92400e] text-white shadow-[0_10px_30px_-10px_rgba(217,119,6,0.4)] hover:-translate-y-1 border-b-4 border-[#78350f]',
    outline: 'border-2 border-emerald-900/10 text-emerald-900 hover:bg-emerald-50 hover:border-emerald-900/30',
    ghost: 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-50/50',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-4 text-[11px]',
    lg: 'px-12 py-6 text-[13px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
