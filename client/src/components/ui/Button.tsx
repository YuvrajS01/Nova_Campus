import React from 'react';
import { cn } from '@/lib/utils';

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
