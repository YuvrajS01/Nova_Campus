import React from 'react';
import { Header } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { Moon, Sun, Settings, LogOut, ChevronRight, Shield, HelpCircle } from 'lucide-react';
import { useTheme } from '@/App';
import { useAuth } from '@/contexts/AuthContext';

export const Profile: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <Header title="Profile" rightAction={<Settings className="text-gray-500" />} />

      {/* Avatar Section */}
      <div className="flex flex-col items-center py-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-400 to-blue-400 p-1 mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-brand-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <h2 className="text-2xl font-bold font-display dark:text-white">{user?.name || 'User'}</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {user?.branch || 'Student'} {user?.year ? `• Year ${user.year}` : ''} {user?.section ? `• Section ${user.section}` : ''}
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="default">{user?.role || 'student'}</Badge>
          <Badge variant="success">{user?.email}</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Preferences</h3>

        <Card className="flex items-center justify-between" noPadding>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-surface2 flex items-center justify-center">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className="font-medium dark:text-gray-200">Dark Mode</span>
          </div>
          <div className="pr-4">
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-brand-400' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Account</h3>

        <button className="w-full">
          <Card className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-surface2" noPadding>
            <div className="flex items-center gap-3 pl-4">
              <Shield size={20} className="text-gray-500" />
              <span className="font-medium dark:text-gray-200">Privacy & Security</span>
            </div>
            <ChevronRight size={20} className="mr-4 text-gray-400" />
          </Card>
        </button>

        <button className="w-full">
          <Card className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-surface2" noPadding>
            <div className="flex items-center gap-3 pl-4">
              <HelpCircle size={20} className="text-gray-500" />
              <span className="font-medium dark:text-gray-200">Help & Support</span>
            </div>
            <ChevronRight size={20} className="mr-4 text-gray-400" />
          </Card>
        </button>

        <Button
          variant="ghost"
          className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600"
          onClick={logout}
        >
          <LogOut size={18} /> Sign Out
        </Button>
      </div>
    </div>
  );
};
