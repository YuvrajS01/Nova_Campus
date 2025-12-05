import React from 'react';
import { cn } from '@/lib/utils';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("px-4 pb-24 pt-4 min-h-screen max-w-md mx-auto w-full", className)}>
        {children}
    </div>
);
