import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-400 text-black hover:bg-brand-300 focus:ring-brand-400 shadow-[0_0_20px_-5px_rgba(204,255,0,0.4)]",
    secondary: "bg-white dark:bg-dark-surface2 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface2",
    icon: "p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-dark-surface2 text-gray-700 dark:text-gray-300 rounded-full",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], variant !== 'icon' && sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

// Card Component
export const Card: React.FC<HTMLMotionProps<"div"> & { noPadding?: boolean }> = ({ className, children, noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-sm rounded-3xl overflow-hidden",
        !noPadding && "p-5",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Badge Component
export const Badge: React.FC<{ variant?: 'default' | 'success' | 'warning' | 'error' | 'outline', children: React.ReactNode, className?: string }> = ({ variant = 'default', children, className }) => {
  const variants = {
    default: "bg-gray-100 dark:bg-dark-surface2 text-gray-700 dark:text-gray-300",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    outline: "bg-transparent border border-gray-200 dark:border-dark-border text-gray-500",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-transparent", variants[variant], className)}>
      {children}
    </span>
  );
};

// Input Component
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
        className
      )}
      {...props}
    />
  );
});

// Skeleton Loader
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 dark:bg-dark-surface2 rounded-lg", className)} />
);

// Container
export const PageContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("px-4 pb-24 pt-4 min-h-screen max-w-md mx-auto w-full", className)}>
    {children}
  </div>
);
