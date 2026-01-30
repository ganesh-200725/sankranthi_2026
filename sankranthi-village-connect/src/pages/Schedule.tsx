import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleEvent {
  id: string;
  name: string;
  emoji: string;
  date: string;
  time?: string;
  location: string;
  type: 'game' | 'ceremony' | 'performance' | 'food';
  description?: string;
}

interface Game {
  id: string;
  name: string;
  emoji: string;
  date?: string;
  time?: string;
  location?: string;
  participants?: string;
  description: string;
  type?: string;
}

import { API_URL } from '@/config/api';


// Static ceremony/performance events


const typeColors = {
  game: 'bg-primary/10 text-primary border-primary/20',
  ceremony: 'bg-secondary/10 text-secondary border-secondary/20',
  performance: 'bg-accent/10 text-accent-foreground border-accent/20',
  food: 'bg-festival-sunset/10 text-festival-terracotta border-festival-sunset/20',
};

const typeLabels = {
  game: '🎮 Game',
  ceremony: '🪔 Ceremony',
  performance: '💃 Performance',
  food: '🍛 Food',
};

export default function Schedule() {
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then((games: Game[]) => {
        const backendEvents: ScheduleEvent[] = games.map(game => ({
          id: game.id,
          name: game.name,
          emoji: game.emoji,
          date: game.date || 'January 14, 2026', // Default to Jan 14 if missing
          time: game.time,
          location: game.location || 'Main Street Devada',
          type: (game.type as 'game' | 'ceremony' | 'performance' | 'food') || 'game',
          description: game.description,
        }));

        setScheduleEvents(backendEvents);
      })
      .catch(() => {
        toast.error('Failed to load games schedule');
        setScheduleEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group events by date
  const eventsByDate = scheduleEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">📅</span>
              <h1 className="text-2xl md:text-3xl font-semibold text-white text-shadow-md">
                Event Schedule
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🗓️</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Complete timeline of all Sankranthi 2026 events. Don't miss any celebration!
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {Object.entries(typeLabels).map(([type, label]) => (
              <span
                key={type}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${typeColors[type as keyof typeof typeColors]}`}
              >
                {label}
              </span>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading schedule...</p>
            </div>
          ) : (
            /* Schedule Timeline */
            <div className="max-w-3xl mx-auto space-y-8">
              {Object.entries(eventsByDate).map(([date, events]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="glass-card p-4 mb-4 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-lg font-medium text-white text-shadow-sm">{date}</h2>
                  </div>

                  {/* Events for this date */}
                  <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="glass-card-hover p-4 ml-4 relative"
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-festival" />

                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Emoji Icon */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shadow-festival shrink-0">
                            <span className="text-2xl">{event.emoji}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-base text-white text-shadow-md">
                                {event.name}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[event.type]}`}>
                                {typeLabels[event.type]}
                              </span>
                            </div>

                            {event.description && (
                              <p className="text-sm font-medium text-white/90 mb-2 text-shadow-sm">
                                {event.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              {/* Time */}
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-primary" />
                                {event.time ? (
                                  <span className="font-bold text-white text-shadow-md bg-black/20 px-2 py-0.5 rounded">{event.time}</span>
                                ) : (
                                  <span className="text-white/80 italic font-medium">
                                    ⏳ Will be informed later
                                  </span>
                                )}
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-secondary text-shadow-sm" />
                                <span className="text-white font-medium text-shadow-sm">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Note */}
          <div className="mt-10 text-center">
            <div className="glass-card inline-block px-6 py-4">
              <p className="text-sm text-muted-foreground">
                📢 Schedule may be updated. Check with committee for latest timings!
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
