import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, ArrowRight, Clock, MapPin, Zap } from 'lucide-react';
import { Card, Button, Badge, cn } from '../components/UI';
import { PullToRefresh } from '../components/PullToRefresh';
import { TabView } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { announcementsApi, timetableApi, Announcement, TimetableEntry } from '../services/api';

interface DashboardProps {
  onNavigate: (tab: TabView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [announcementData, timetableData] = await Promise.all([
        announcementsApi.getAll().catch(() => []),
        timetableApi.getForUser().catch(() => []),
      ]);
      setAnnouncements(announcementData);
      setTimetable(timetableData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get current/next class based on time
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sunday
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const todayClasses = timetable
    .filter(t => t.dayOfWeek === currentDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const currentClass = todayClasses.find(c => c.startTime <= currentTime && c.endTime > currentTime);
  const nextClass = currentClass
    ? todayClasses.find(c => c.startTime > currentClass.endTime)
    : todayClasses.find(c => c.startTime > currentTime);

  const displayClass = currentClass || nextClass;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Greeting Header */}
        <div className="flex justify-between items-center py-2">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium font-display">{formatDate()}</p>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Hello, <span className="text-brand-600 dark:text-brand-400">{user?.name?.split(' ')[0] || 'Student'}</span>
            </h1>
          </div>
          <Button variant="icon" className="relative">
            <Bell className="w-6 h-6" />
            {announcements.some(a => a.isImportant) && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-50 dark:border-dark-bg"></span>
            )}
          </Button>
        </div>

        {/* Ongoing/Next Class Hero Card */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-lg font-bold font-display dark:text-gray-200">
              {currentClass ? 'Happening Now' : nextClass ? 'Up Next' : 'Today'}
            </h2>
            <button onClick={() => onNavigate('timetable')} className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              View Schedule
            </button>
          </div>

          {displayClass ? (
            <Card className="bg-gray-900 dark:bg-brand-400 text-white dark:text-black border-none relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 dark:bg-black/10 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono font-medium">
                    {displayClass.startTime} - {displayClass.endTime}
                  </div>
                  <Badge variant={currentClass ? "success" : "default"} className="dark:bg-black/20 dark:text-black border-none">
                    {currentClass ? 'Ongoing' : 'Next'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold mb-1 leading-tight">{displayClass.subject}</h3>
                  <p className="opacity-80 text-sm">{displayClass.faculty || 'TBA'}</p>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="p-1.5 bg-white/20 dark:bg-black/10 rounded-full">
                    <MapPin size={14} />
                  </div>
                  {displayClass.room || 'TBA'}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-100 dark:bg-dark-surface text-center py-8">
              <Clock className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-gray-500 dark:text-gray-400">No classes scheduled for today</p>
            </Card>
          )}
        </motion.div>

        {/* Quick Actions (Grid) */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate('resources')} className="flex flex-col gap-3 p-4 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm active:scale-95 transition-transform text-left group">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Search size={20} />
            </div>
            <div>
              <span className="block font-bold dark:text-gray-200">Library</span>
              <span className="text-xs text-gray-500">Find papers</span>
            </div>
          </button>
          <button onClick={() => onNavigate('events')} className="flex flex-col gap-3 p-4 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm active:scale-95 transition-transform text-left group">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <div>
              <span className="block font-bold dark:text-gray-200">Events</span>
              <span className="text-xs text-gray-500">What's on</span>
            </div>
          </button>
        </motion.div>

        {/* Recent Notices */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="text-lg font-bold font-display dark:text-gray-200">Latest Updates</h2>
            <button onClick={() => onNavigate('notices')} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.slice(0, 2).map((announcement) => (
                <Card key={announcement.id} className="active:scale-[0.99] transition-transform cursor-pointer flex gap-4 items-start" noPadding>
                  <div className={cn("w-1.5 self-stretch shrink-0",
                    announcement.tag === 'Exam' ? 'bg-blue-500' :
                      announcement.tag === 'Holiday' ? 'bg-brand-400' :
                        announcement.tag === 'Fee' ? 'bg-red-500' : 'bg-gray-400'
                  )} />
                  <div className="py-4 pr-4 flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{announcement.tag}</span>
                      <span className="text-xs text-gray-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{announcement.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{announcement.body}</p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-6 text-gray-400">
                No announcements yet
              </Card>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PullToRefresh>
  );
};