import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  
  const variants = {
    neutral: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    brand: "bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};