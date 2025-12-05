import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
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
    }
);

Input.displayName = 'Input';
