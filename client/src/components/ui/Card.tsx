import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, noPadding = false, ...props }) => {
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
