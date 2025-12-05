import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { Header } from '@/components/layout';
import { Clock, MapPin, User } from 'lucide-react';
import { timetableApi, TimetableEntry } from '@/services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const Timetable: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const data = await timetableApi.getForUser();
        setTimetable(data);
      } catch (error) {
        console.error('Failed to fetch timetable:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const selectedDayOfWeek = selectedDate.getDay();

  const dayClasses = timetable
    .filter(t => t.dayOfWeek === selectedDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Generate dates: Start from the beginning of the current week (Sunday) and go for 30 days
  const dates: Date[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }

  return (
    <div className="space-y-6">
      <Header title="Timetable" />

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        {dates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === now.toDateString();
          const dayName = DAYS[date.getDay()];

          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`
                relative flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all duration-300 border shrink-0
                ${isSelected
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg scale-105 z-10'
                  : 'bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400 border-gray-100 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <span className="text-xs font-medium opacity-60 uppercase">{dayName}</span>
              <span className="text-xl font-display font-bold mt-1">{date.getDate()}</span>
              {isToday && !isSelected && (
                <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-brand-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-gray-200 dark:border-dark-border ml-3 space-y-8 pl-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading schedule...</div>
            ) : dayClasses.length > 0 ? (
              dayClasses.map((cls) => {
                const isOngoing = selectedDate.toDateString() === now.toDateString() &&
                  cls.startTime <= currentTime &&
                  cls.endTime > currentTime;

                return (
                  <div key={cls.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[31px] top-6 w-4 h-4 rounded-full border-4 border-gray-50 dark:border-dark-bg ${isOngoing ? 'bg-brand-400 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />

                    <span className="text-xs font-mono text-gray-400 absolute -top-5 left-0">{cls.startTime}</span>

                    <Card className={`group transition-all duration-300 ${isOngoing ? 'border-brand-400 ring-1 ring-brand-400 shadow-xl shadow-brand-400/10' : 'hover:border-gray-300 dark:hover:border-gray-600'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="dark:text-gray-400">
                          {isOngoing ? 'Ongoing' : 'Class'}
                        </Badge>
                        <span className="text-xs font-mono text-gray-500">{cls.endTime} end</span>
                      </div>
                      <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-1">{cls.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {cls.room || 'TBA'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={14} />
                          {cls.faculty || 'TBA'}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Clock size={48} className="mb-4 opacity-20" />
                <p>No classes scheduled for {DAY_NAMES[selectedDayOfWeek]}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
