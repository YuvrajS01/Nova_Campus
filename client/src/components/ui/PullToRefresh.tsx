import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const y = useMotionValue(0);
    const startY = useRef(0);

    const rotate = useTransform(y, [0, 100], [0, 360]);
    const opacity = useTransform(y, [0, 40], [0, 1]);
    const scale = useTransform(y, [0, 80], [0.5, 1]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY < 10 && !isRefreshing) {
            startY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY.current === 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        if (diff > 0 && window.scrollY < 10) {
            const val = Math.min(diff * 0.45, 160);
            y.set(val);
        }
    };

    const handleTouchEnd = async () => {
        if (startY.current === 0 || isRefreshing) return;

        const currentY = y.get();
        startY.current = 0;

        if (currentY > 75) {
            setIsRefreshing(true);
            animate(y, 75, { type: "spring", stiffness: 300, damping: 25 });

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                animate(y, 0, { type: "spring", stiffness: 300, damping: 25 });
            }
        } else {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 25 });
        }
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative z-0 min-h-full"
        >
            <motion.div
                style={{ y: useTransform(y, val => val - 60), opacity, scale, x: "-50%" }}
                className="absolute top-4 left-1/2 z-50 pointer-events-none"
            >
                <div className="bg-white dark:bg-dark-surface2 p-2.5 rounded-full shadow-xl border border-gray-100 dark:border-dark-border text-brand-600 dark:text-brand-400">
                    <motion.div
                        style={{ rotate }}
                        animate={isRefreshing ? { rotate: 360 } : {}}
                        transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : {}}
                    >
                        <Loader2 size={20} strokeWidth={2.5} />
                    </motion.div>
                </div>
            </motion.div>

            <motion.div style={{ y }} className="relative z-10">
                {children}
            </motion.div>
        </div>
    );
};
