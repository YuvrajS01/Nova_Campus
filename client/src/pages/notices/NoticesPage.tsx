import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout';
import { Card, Badge, Input } from '@/components/ui';
import { PullToRefresh } from '@/components/ui';
import { Search } from 'lucide-react';
import { announcementsApi, Announcement } from '@/services/api';

const FILTERS = ['All', 'Exam', 'Fee', 'Holiday', 'Placement', 'General'];

export const Notices: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementsApi.getAll();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredNotices = announcements.filter(n =>
    (activeFilter === 'All' || n.tag === activeFilter) &&
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchAnnouncements();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4">
        <Header title="Notices" />

        {/* Search & Filter */}
        <div className="sticky top-[72px] z-20 bg-gray-50/95 dark:bg-dark-bg/95 backdrop-blur-sm pb-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search updates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeFilter === filter
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400'}
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pb-8">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card className="flex flex-col gap-3 group">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={notice.isImportant ? 'error' : 'default'}
                      className={notice.isImportant ? '' : 'bg-gray-100 dark:bg-dark-surface2'}
                    >
                      {notice.tag}
                    </Badge>
                    <span className="text-xs text-gray-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {notice.isImportant && <span className="w-2 h-2 rounded-full bg-brand-400" />}
                      <h3 className="font-bold font-display text-gray-900 dark:text-gray-100 leading-snug">{notice.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{notice.body}</p>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              No notices found.
            </div>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
};