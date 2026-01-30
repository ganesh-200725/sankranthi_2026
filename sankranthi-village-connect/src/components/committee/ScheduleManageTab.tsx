import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Clock, MapPin, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleEvent {
  id: string;
  name: string;
  emoji: string;
  date: string;
  time?: string;
  location: string;
  type?: string;
  description?: string;
}

import { API_URL } from '@/config/api';


interface ScheduleManageTabProps {
  canManage: boolean;
}

export function ScheduleManageTab({ canManage }: ScheduleManageTabProps) {
  const { user, hasRole } = useAuth();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    time: '',
    location: '',
    emoji: '🎉',
    date: 'January 14, 2026',
    type: 'game',
    description: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/games`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleUpdateTime = async (id: string, newTime: string) => {
    try {
      const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ time: newTime }),
      });
      if (!res.ok) throw new Error();
      toast.success('Event time updated!');
      fetchEvents();
      setEditingId(null);
    } catch {
      toast.error('Failed to update time');
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.name.trim() || !newEvent.location.trim()) {
      toast.error('Please fill in event name and location');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error();
      toast.success('Event added!');
      fetchEvents();
      setNewEvent({
        name: '',
        time: '',
        location: '',
        emoji: '🎉',
        date: 'January 14, 2026',
        type: 'game',
        description: ''
      });
      setShowAddForm(false);
    } catch {
      toast.error('Failed to add event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
      });
      if (!res.ok) throw new Error();
      toast.success('Event deleted');
      fetchEvents();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {canManage && (
        <div className="glass-card p-6">
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)} className="btn-festival">
              <Plus className="w-4 h-4 mr-2" />
              Add New Event
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Add New Event</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Event Name</Label>
                  <Input
                    placeholder="e.g., Musical Chairs"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Emoji</Label>
                  <Input
                    placeholder="🎉"
                    value={newEvent.emoji}
                    onChange={(e) => setNewEvent({ ...newEvent, emoji: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    placeholder="January 14, 2026"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Time (optional)</Label>
                  <Input
                    placeholder="e.g., 3:00 PM - 4:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g., Village Ground"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddEvent} className="btn-festival">
                  Add Event
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Events List */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">All Events</h3>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No events found.</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-sunset flex items-center justify-center shrink-0">
                      <span className="text-xl">{event.emoji}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{event.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {editingId === event.id ? (
                            <Input
                              className="h-7 w-40"
                              placeholder="Enter time..."
                              defaultValue={event.time || ''}
                              onBlur={(e) => handleUpdateTime(event.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateTime(event.id, (e.target as HTMLInputElement).value);
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <span>{event.time || '⏳ Will be informed later'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(event.id)}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!canManage && (
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground">
            🔒 Only Event Managers can add or edit events
          </p>
        </div>
      )}
    </div>
  );
}
