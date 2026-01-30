import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000';

interface User {
    username: string;
    role: string;
}

export default function ManageTeamTab() {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({
        username: '',
        password: '',
        role: 'committee'
    });

    const loadTeam = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTeamMembers(data);
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error('Failed to load team:', res.status, errData);
                toast.error(`Access Denied: ${errData.error || 'Check login session'}`);
            }
        } catch (e) {
            console.error('Network error loading team:', e);
            toast.error('Network error - check if server is running');
        }
    };

    useEffect(() => {
        if (user) {
            loadTeam();
        }
    }, [user]);

    const handleAddMember = async () => {
        if (!newMember.username || !newMember.password) {
            toast.error('Username and password required');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    username: newMember.username,
                    password: newMember.password,
                    role: newMember.role
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to add');
            }

            const added = await res.json();
            setTeamMembers([...teamMembers, added]);
            setNewMember({ username: '', password: '', role: 'committee' });
            setShowAddForm(false);
            toast.success('Member added successfully!');
        } catch (e) {
            toast.error((e as Error).message);
        }
    };

    const handleDeleteMember = async (idOrUsername: string) => {
        // Backend delete uses ID: app.delete('/admin/users/:id', ...)
        // Let's find the user ID first
        const userToDelete = teamMembers.find(m => m.username === idOrUsername || (m as any).id === idOrUsername);
        if (!userToDelete) return;
        const targetId = (userToDelete as any).id || idOrUsername;

        if (!confirm(`Remove access for ${userToDelete.username}?`)) return;

        try {
            const res = await fetch(`${API_URL}/admin/users/${targetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to delete');
            }

            setTeamMembers(teamMembers.filter(m => (m as any).id !== targetId && m.username !== idOrUsername));
            toast.success('Member removed');
        } catch (e) {
            toast.error((e as Error).message);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Manage Committee Team
                    </h2>
                    <p className="text-muted-foreground">
                        Add or remove access for committee members.
                    </p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="btn-festival">
                    {showAddForm ? 'Cancel' : (
                        <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                        </>
                    )}
                </Button>
            </div>

            {showAddForm && (
                <div className="glass-card p-6 max-w-xl">
                    <h3 className="font-semibold text-lg mb-4">Add New Team Member</h3>
                    <div className="grid gap-4">
                        <div>
                            <Label>Username</Label>
                            <Input
                                value={newMember.username}
                                onChange={e => setNewMember({ ...newMember, username: e.target.value })}
                                placeholder="Unique username"
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                value={newMember.password}
                                onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={newMember.role}
                                onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                            >
                                <option value="financial_manager">1. Financial Management</option>
                                <option value="event_manager">2. Edit Games & Schedule</option>
                                <option value="rangoli_manager">3. Rangoli Management</option>
                                <option value="dance_manager">4. Dance Management</option>
                                <option value="committee">General Committee Member</option>
                                <option value="judge">Judge</option>
                            </select>
                        </div>
                        <Button onClick={handleAddMember} className="w-full btn-festival mt-2">
                            Add User
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                    <div key={member.username} className="glass-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                                {member.username.substring(0, 2)}
                            </div>
                            <div>
                                <p className="font-semibold">{member.username}</p>
                                <p className="text-xs text-muted-foreground capitalize">{member.role.replace('_', ' ')}</p>
                            </div>
                        </div>
                        {/* Show delete only if not ganesh */}
                        {member.username !== 'ganesh' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteMember(member.username)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
