import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("animate-pulse bg-gray-200 dark:bg-dark-surface2 rounded-lg", className)} />
);
