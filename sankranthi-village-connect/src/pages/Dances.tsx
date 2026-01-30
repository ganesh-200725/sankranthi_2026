import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, User, Users, Plus, Music } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000';

interface DanceTeam {
  id: string;
  name: string;
  members: string[];
  timeSlot?: string;
}

export default function Dances() {
  const { user, hasRole } = useAuth(); // Get auth role and user
  const isCommittee = hasRole(['dance_manager']) || user?.username.toLowerCase() === 'ganesh';

  const [teams, setTeams] = useState<DanceTeam[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', members: '' });

  // Load teams only if committee member
  useEffect(() => {
    if (isCommittee) {
      fetch(`${API_URL}/dance-teams`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      })
        .then(res => res.json())
        .then(data => setTeams(data))
        .catch(() => toast.error('Failed to load teams'));
    }
  }, [isCommittee, user?.token]);

  const handleRegister = async () => {
    if (!newTeam.name.trim() || !newTeam.members.trim()) {
      toast.error('Please fill in team name and members');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/dance-teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name: newTeam.name.trim(),
          members: newTeam.members.split(',').map(m => m.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Failed to register');

      const addedTeam = await res.json();

      // If committee, update list immediately
      if (isCommittee) {
        setTeams([...teams, addedTeam]);
      }

      setNewTeam({ name: '', members: '' });
      setShowRegister(false);
      toast.success('Team registered successfully! Committee will assign a time slot.');
    } catch {
      toast.error('Failed to register team');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team?')) return;
    try {
      const res = await fetch(`${API_URL}/dance-teams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setTeams(teams.filter(t => t.id !== id));
      toast.success('Team removed');
    } catch {
      toast.error('Failed to delete team');
    }
  };

  const handleUpdateTime = async (id: string, timeSlot: string) => {
    try {
      const res = await fetch(`${API_URL}/dance-teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ timeSlot }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setTeams(teams.map(t => t.id === id ? { ...t, timeSlot } : t));
      toast.success('Time slot updated');
    } catch {
      toast.error('Failed to update time');
    }
  };

  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">💃</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Dance Performances
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🎶</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Night dance performances on Sankranthi 2026. Register your team and shine on stage!
            </p>
          </div>

          {/* Event Info */}
          <div className="glass-card p-6 max-w-2xl mx-auto mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Music className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-lg">Dance Night Event</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              📅 January 14, 2026 • 🕢 7:30 PM onwards • 📍 Main Stage
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                🎵 All Dance Styles Welcome
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                👥 Solo & Group Performances
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm">
                🏆 Prizes for Winners
              </span>
            </div>
          </div>

          {/* Register Button - Visible to Everyone */}
          <div className="text-center mb-8">
            {!showRegister ? (
              <Button onClick={() => setShowRegister(true)} className="btn-festival">
                <Plus className="w-5 h-5 mr-2" />
                Register Your Team
              </Button>
            ) : (
              <div className="glass-card p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-lg mb-4">Register Dance Team</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Team Name</Label>
                    <Input
                      placeholder="e.g., Dancing Stars"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Team Members (comma separated)</Label>
                    <Input
                      placeholder="e.g., Priya, Kavya, Anjali"
                      value={newTeam.members}
                      onChange={(e) => setNewTeam({ ...newTeam, members: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRegister} className="btn-festival flex-1">
                      Register
                    </Button>
                    <Button variant="outline" onClick={() => setShowRegister(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teams List - RESTRICTED TO COMMITTEE ONLY */}
          {isCommittee ? (
            <div className="max-w-3xl mx-auto">
              <h3 className="font-semibold text-xl mb-4 text-center">
                🎭 Registered Teams ({teams.length}) <span className="text-xs font-normal text-muted-foreground ml-2">(Visible only to Committee)</span>
              </h3>
              <div className="space-y-4">
                {teams.length === 0 && (
                  <p className="text-center text-muted-foreground">No registered teams yet.</p>
                )}
                {teams.map((team, index) => (
                  <div key={team.id} className="glass-card-hover p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Team Number */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-festival shrink-0">
                        <span className="text-xl font-bold text-white">{index + 1}</span>
                      </div>

                      {/* Team Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-foreground">{team.name}</h4>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8"
                            onClick={() => handleDelete(team.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{team.members.length} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {team.timeSlot ? (
                              <input
                                className="bg-transparent border-b border-primary text-foreground w-24 focus:outline-none"
                                defaultValue={team.timeSlot}
                                onBlur={(e) => handleUpdateTime(team.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleUpdateTime(team.id, (e.target as HTMLInputElement).value);
                                }}
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="italic">⏳ TBA</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => handleUpdateTime(team.id, '8:00 PM')} // Default start
                                >
                                  Assign Time
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {team.members.map((member, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                          >
                            <User className="w-3 h-3" />
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground italic">
                Thank you for registering! The committee will review applications and finalize the schedule.
              </p>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
