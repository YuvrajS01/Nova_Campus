import React from 'react';

interface HeaderProps {
    title?: string;
    rightAction?: React.ReactNode;
    showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, rightAction }) => {
    return (
        <header className="flex items-center justify-between py-4 sticky top-0 z-30 bg-gray-50/80 dark:bg-dark-bg/80 backdrop-blur-md">
            <div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                {rightAction}
            </div>
        </header>
    );
};
