import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './UI';
import { TabView } from '../types';
import { Home, Calendar, Bell, MapPin, BookOpen, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: TabView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'staff' || user?.role === 'admin';

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'timetable', label: 'Schedule', icon: Calendar },
    { id: 'notices', label: 'Alerts', icon: Bell },
    { id: 'events', label: 'Events', icon: MapPin },
    { id: 'resources', label: 'Library', icon: BookOpen },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-0 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto w-full max-w-md bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border border-gray-200/50 dark:border-dark-border/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 flex justify-between items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as TabView)}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-12 rounded-2xl transition-all duration-300",
                isActive ? "text-black" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-brand-400 rounded-2xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

interface HeaderProps {
  title?: string;
  rightAction?: React.ReactNode;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, rightAction, showBack }) => {
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
