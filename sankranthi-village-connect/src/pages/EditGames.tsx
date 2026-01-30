import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id: string;
  name: string;
  emoji: string;
  time?: string;
  location?: string;
  participants?: string;
  description: string;
}


const API_URL = 'http://localhost:5000';


export default function EditGames() {
  const { user, hasRole } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', time: '', location: '', participants: '', emoji: '🎮', description: '' });
  const [loading, setLoading] = useState(false);

  // Fetch games from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => setGames(data.filter((g: any) => !g.type || g.type === 'game')))
      .catch(() => toast.error('Failed to load games'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddGame = async () => {
    if (!newGame.name.trim() || !newGame.location.trim() || !newGame.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name: newGame.name.trim(),
          emoji: newGame.emoji,
          time: newGame.time || undefined,
          location: newGame.location.trim(),
          participants: newGame.participants.trim() || undefined,
          description: newGame.description.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to add game');
      const added = await res.json();
      setGames([...games, added]);
      setNewGame({ name: '', time: '', location: '', participants: '', emoji: '🎮', description: '' });
      setShowAddForm(false);
      toast.success('Game added!');
    } catch {
      toast.error('Failed to add game');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setGames(games.filter(g => g.id !== id));
      toast.success('Game deleted');
    } catch {
      toast.error('Failed to delete game');
    }
  };

  const handleUpdateGame = async (id: string, updated: Partial<Game>) => {
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
      const updatedGame = await res.json();
      setGames(games.map(g => g.id === id ? updatedGame : g));
      setEditingId(null);
      toast.success('Game updated!');
    } catch {
      toast.error('Failed to update game');
    }
  };

  // Only allow authorized users to edit
  const isMainAdmin = user?.username.toLowerCase() === 'ganesh';
  const canEdit = hasRole(['event_manager']) || isMainAdmin;

  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">🎮</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Edit Festival Games
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🏆</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Add, edit, or remove games for the festival schedule.
            </p>
          </div>

          {/* Add Button (only for hari) */}
          {canEdit && (
            <div className="mb-6">
              {!showAddForm ? (
                <Button onClick={() => setShowAddForm(true)} className="btn-festival">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Game
                </Button>
              ) : (
                <div className="glass-card p-6 mb-4">
                  <h3 className="font-semibold text-lg mb-4">Add New Game</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Game Name</Label>
                      <Input
                        placeholder="e.g., Musical Chairs"
                        value={newGame.name}
                        onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Emoji</Label>
                      <Input
                        placeholder="🎮"
                        value={newGame.emoji}
                        onChange={(e) => setNewGame({ ...newGame, emoji: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Time (optional)</Label>
                      <Input
                        placeholder="e.g., 3:00 PM - 4:00 PM"
                        value={newGame.time}
                        onChange={(e) => setNewGame({ ...newGame, time: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        placeholder="e.g., Village Ground"
                        value={newGame.location}
                        onChange={(e) => setNewGame({ ...newGame, location: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Participants (optional)</Label>
                      <Input
                        placeholder="e.g., All ages"
                        value={newGame.participants}
                        onChange={(e) => setNewGame({ ...newGame, participants: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Game description"
                        value={newGame.description}
                        onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddGame} className="btn-festival">
                      Add Game
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Games List */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-lg mb-4">All Games</h3>
            <div className="space-y-3">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-sunset flex items-center justify-center shrink-0">
                        <span className="text-xl">{game.emoji}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{game.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {canEdit && editingId === game.id ? (
                              <Input
                                className="h-7 w-40"
                                placeholder="Enter time..."
                                defaultValue={game.time || ''}
                                onBlur={(e) => handleUpdateGame(game.id, { time: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateGame(game.id, { time: (e.target as HTMLInputElement).value });
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              <span>{game.time || '⏳ Will be informed later'}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{game.location}</span>
                          </div>
                          {game.participants && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{game.participants}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {game.description}
                        </div>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(game.id)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(game.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
