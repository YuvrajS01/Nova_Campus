import React, { useState, useEffect, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/ui';
import { BottomNav } from '@/components/layout';
import { Dashboard } from '@/pages/dashboard/DashboardPage';
import { Timetable } from '@/pages/timetable/TimetablePage';
import { Notices } from '@/pages/notices/NoticesPage';
import { Events } from '@/pages/events/EventsPage';
import { Resources } from '@/pages/resources/ResourcesPage';
import { Profile } from '@/pages/profile/ProfilePage';
import { Login } from '@/pages/auth/LoginPage';
import { Register } from '@/pages/auth/RegisterPage';
import { Admin } from '@/pages/admin/AdminPage';
import { TabView, Theme } from '@/types';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Theme Context
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => { } });
export const useTheme = () => useContext(ThemeContext);

const AppContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabView>('dashboard');
    const [theme, setTheme] = useState<Theme>('dark');
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const { isAuthenticated, isLoading } = useAuth();

    // Theme Toggling Logic
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    // Loading state
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="w-16 h-16 bg-brand-400 rounded-2xl rotate-45 animate-pulse-slow blur-xl absolute inset-0" />
                    <div className="w-16 h-16 bg-brand-400 rounded-2xl rotate-45 relative flex items-center justify-center shadow-2xl shadow-brand-400/50">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black rotate-[-45deg]">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </motion.div>
                <h1 className="mt-8 text-white font-display font-bold text-xl tracking-widest uppercase">Nova Campus</h1>
            </div>
        );
    }

    // Auth screens
    if (!isAuthenticated) {
        if (authView === 'login') {
            return <Login onSwitchToRegister={() => setAuthView('register')} />;
        }
        return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }

    const renderScreen = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
            case 'timetable': return <Timetable />;
            case 'notices': return <Notices />;
            case 'events': return <Events />;
            case 'resources': return <Resources />;
            case 'profile': return <Profile />;
            case 'admin': return <Admin />;
            default: return <Dashboard onNavigate={setActiveTab} />;
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <PageContainer>
                <AnimatePresence mode="wait">
                    <motion.main
                        key={activeTab}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[85vh]"
                    >
                        {renderScreen()}
                    </motion.main>
                </AnimatePresence>
            </PageContainer>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </ThemeContext.Provider>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
