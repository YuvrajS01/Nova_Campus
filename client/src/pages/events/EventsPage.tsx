import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { PullToRefresh } from '@/components/ui';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { eventsApi, Event } from '@/services/api';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const data = await eventsApi.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchEvents();
  };

  const handleRegister = async (eventId: string) => {
    setRegisteringId(eventId);
    try {
      await eventsApi.register(eventId);
      // Update local state to show registered
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, isRegistered: true } : e
      ));
    } catch (error) {
      console.error('Failed to register:', error);
    } finally {
      setRegisteringId(null);
    }
  };

  // Generate placeholder image URL based on event
  const getEventImage = (event: Event) => {
    return `https://picsum.photos/seed/${event.id}/800/400`;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
        <Header title="Campus Life" rightAction={<Button variant="icon"><Calendar size={20} /></Button>} />

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading events...</div>
          ) : events.length > 0 ? (
            events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card noPadding className="group overflow-hidden bg-white dark:bg-dark-surface">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-none mb-2">Event</Badge>
                      <h3 className="text-xl font-bold font-display">{event.title}</h3>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl px-3 py-2 text-center min-w-[60px]">
                      <span className="block text-xs font-bold uppercase text-red-500">
                        {new Date(event.startTime).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="block text-xl font-display font-bold text-gray-900 dark:text-white">
                        {new Date(event.startTime).getDate()}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <ClockIcon /> {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin size={16} /> {event.location}
                      </div>
                    </div>
                    {event.isRegistered ? (
                      <Badge variant="success">Registered</Badge>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleRegister(event.id)}
                        disabled={registeringId === event.id}
                      >
                        {registeringId === event.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          'Register'
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">No events scheduled</div>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
};

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)