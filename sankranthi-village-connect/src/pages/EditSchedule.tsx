import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Clock, MapPin, Calendar, Tag } from 'lucide-react';
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
    participants?: string;
}

import { API_URL } from '@/config/api';


const typeLabels = {
    game: '🎮 Game',
    ceremony: '🪔 Ceremony',
    performance: '💃 Performance',
    food: '🍛 Food',
};

export default function EditSchedule() {
    const { user, hasRole } = useAuth();
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newEvent, setNewEvent] = useState<Omit<ScheduleEvent, 'id'>>({
        name: '',
        emoji: '📅',
        date: 'January 14, 2026',
        time: '',
        location: '',
        type: 'game',
        description: '',
        participants: ''
    });

    // Fetch all events from backend
    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/games`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(() => toast.error('Failed to load schedule events'))
            .finally(() => setLoading(false));
    }, []);

    const handleAddEvent = async () => {
        if (!newEvent.name.trim() || !newEvent.location.trim()) {
            toast.error('Name and Location are required');
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
            if (!res.ok) throw new Error('Failed to add event');
            const added = await res.json();
            setEvents([...events, added]);
            setNewEvent({
                name: '',
                emoji: '📅',
                date: 'January 14, 2026',
                time: '',
                location: '',
                type: 'game',
                description: '',
                participants: ''
            });
            setShowAddForm(false);
            toast.success('Event added to schedule!');
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
            if (!res.ok) throw new Error('Failed to delete');
            setEvents(events.filter(e => e.id !== id));
            toast.success('Event removed');
        } catch {
            toast.error('Failed to delete event');
        }
    };

    const handleUpdateEvent = async (id: string, updated: Partial<ScheduleEvent>) => {
        try {
            const res = await fetch(`${API_URL}/games/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(updated),
            });
            if (!res.ok) throw new Error('Failed to update');
            const updatedEvent = await res.json();
            setEvents(events.map(e => e.id === id ? updatedEvent : e));
            setEditingId(null);
            toast.success('Event updated!');
        } catch {
            toast.error('Failed to update event');
        }
    };

    const isMainAdmin = user?.username.toLowerCase() === 'ganesh';
    const canEdit = hasRole(['event_manager']) || isMainAdmin;

    if (!canEdit) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center p-8 glass-card">
                        <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
                        <p className="text-muted-foreground">Only committee members can edit the schedule.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="section-festival min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <span className="text-4xl animate-float">📅</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Manage Event Schedule
                            </h1>
                            <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>⚙️</span>
                        </div>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Add, edit, or remove events across all festival categories.
                        </p>
                    </div>

                    <div className="mb-6">
                        {!showAddForm ? (
                            <Button onClick={() => setShowAddForm(true)} className="btn-festival">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Event
                            </Button>
                        ) : (
                            <div className="glass-card p-6 mb-4">
                                <h3 className="font-semibold text-lg mb-4">Add New Event</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Event Name</Label>
                                        <Input
                                            placeholder="e.g., Grand Inauguration"
                                            value={newEvent.name}
                                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select
                                            value={newEvent.type}
                                            onValueChange={(val: any) => setNewEvent({ ...newEvent, type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(typeLabels).map(([val, label]) => (
                                                    <SelectItem key={val} value={val}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Emoji</Label>
                                        <Input
                                            placeholder="🪔"
                                            value={newEvent.emoji}
                                            onChange={(e) => setNewEvent({ ...newEvent, emoji: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input
                                            placeholder="January 14, 2026"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Time</Label>
                                        <Input
                                            placeholder="e.g., 9:00 AM"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            placeholder="e.g., Village Square"
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            placeholder="Describe the event..."
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <Button onClick={handleAddEvent} className="btn-festival">
                                        Add to Schedule
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-6 overflow-hidden">
                        <h3 className="font-semibold text-lg mb-4">All Scheduled Events</h3>
                        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
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
                                        className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shrink-0 shadow-lg">
                                                    <span className="text-2xl">{event.emoji}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-lg">{event.name}</h4>
                                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">
                                                            {event.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                                            <span>{event.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                                            <span>{event.time || 'TBD'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </div>
                                                    {event.description && (
                                                        <p className="text-sm mt-2 text-muted-foreground line-clamp-2 italic">
                                                            "{event.description}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newName = prompt('Enter new name:', event.name);
                                                        if (newName) handleUpdateEvent(event.id, { name: newName });
                                                    }}
                                                    className="hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(event.id)}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
