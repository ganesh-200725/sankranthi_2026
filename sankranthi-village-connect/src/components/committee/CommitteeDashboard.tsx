import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Calendar,
  MessageSquare,
  Camera,
  BarChart3,
  Shield,
  Plus
} from 'lucide-react';
import { ExpendituresTab } from './ExpendituresTab';
import { ScheduleManageTab } from './ScheduleManageTab';
import { SuggestionsTab } from './SuggestionsTab';
import ManageTeamTab from './ManageTeamTab';

import { API_URL } from '@/config/api';


export function CommitteeDashboard() {
  const { user, hasRole, isAuthenticated } = useAuth();
  const [counts, setCounts] = useState({
    games: 0,
    rangoli: 0,
    members: 0,
    dances: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCounts = async () => {
        try {
          const [games, rangoli, members, dances] = await Promise.all([
            fetch(`${API_URL}/games`).then(res => res.json()),
            fetch(`${API_URL}/rangoli`).then(res => res.json()),
            fetch(`${API_URL}/admin/users`, { headers: { 'Authorization': `Bearer ${user?.token}` } }).then(res => res.json()),
            fetch(`${API_URL}/dance-teams`).then(res => res.json()),
          ]);

          setCounts({
            games: (Array.isArray(games) ? games : []).filter((g: any) => !g.type || g.type === 'game').length,
            rangoli: (Array.isArray(rangoli) ? rangoli : []).length,
            members: (Array.isArray(members) ? members : []).length,
            dances: (Array.isArray(dances) ? dances : []).length
          });
        } catch (e) {
          console.error('Error fetching overview counts:', e);
        }
      };
      fetchCounts();
    }
  }, [isAuthenticated, user?.token]);

  const isMainAdmin = user?.username.toLowerCase() === 'ganesh';
  const canManageFinance = hasRole(['financial_manager']) || isMainAdmin;
  const canManageEvents = hasRole(['event_manager']) || isMainAdmin;
  const canManageRangoli = hasRole(['rangoli_manager']) || isMainAdmin;
  const canManageDances = hasRole(['dance_manager']) || isMainAdmin;
  const isCommitteeMember = hasRole(['committee']) || isMainAdmin;

  const isAuthorized = hasRole(['committee', 'financial_manager', 'event_manager', 'rangoli_manager', 'dance_manager']) || isMainAdmin;

  if (!user || !isAuthorized) {
    return null;
  }

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="section-festival min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🙏</span>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome, {user.username}!
                </h1>
              </div>
              <p className="text-muted-foreground">
                Committee Dashboard • Role: <span className="capitalize font-medium text-primary">{user.role.replace('_', ' ')}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/20">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Secure Access</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card h-auto p-2 flex flex-wrap gap-2">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            {(isAuthorized) && (
              <TabsTrigger value="expenditures" className="gap-2">
                <Wallet className="w-4 h-4" />
                Expenditures
              </TabsTrigger>
            )}
            {(isAuthorized) && (
              <TabsTrigger value="schedule" className="gap-2">
                <Calendar className="w-4 h-4" />
                Edit Schedule
              </TabsTrigger>
            )}
            <TabsTrigger value="suggestions" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Suggestions
            </TabsTrigger>
            {(isAuthorized) && (
              <TabsTrigger value="editgames" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Edit Games
              </TabsTrigger>
            )}
            {isMainAdmin && (
              <TabsTrigger value="manageteam" className="gap-2">
                <Shield className="w-4 h-4" />
                Manage Team
              </TabsTrigger>
            )}
          </TabsList>

          {/* Edit Games Tab */}
          <TabsContent value="editgames">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <p className="mb-4 text-lg text-muted-foreground">Edit festival games on a separate page.</p>
              <Link to="/editgames">
                <Button className="btn-festival">Go to Edit Games</Button>
              </Link>
            </div>
          </TabsContent>

          {isMainAdmin && (
            <TabsContent value="manageteam">
              <ManageTeamTab />
            </TabsContent>
          )}

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-6 text-center">
                <span className="text-4xl mb-3 block">🎮</span>
                <h3 className="text-2xl font-bold text-foreground">{counts.games}</h3>
                <p className="text-muted-foreground">Games Scheduled</p>
              </div>
              <div className="glass-card p-6 text-center">
                <span className="text-4xl mb-3 block">🎨</span>
                <h3 className="text-2xl font-bold text-foreground">{counts.rangoli}</h3>
                <p className="text-muted-foreground">Rangoli Entries</p>
              </div>
              <div className="glass-card p-6 text-center">
                <span className="text-4xl mb-3 block">👥</span>
                <h3 className="text-2xl font-bold text-foreground">{counts.members}</h3>
                <p className="text-muted-foreground">Committee Members</p>
              </div>
              <div className="glass-card p-6 text-center">
                <span className="text-4xl mb-3 block">💃</span>
                <h3 className="text-2xl font-bold text-foreground">{counts.dances}</h3>
                <p className="text-muted-foreground">Dance Performances</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span>📋</span> Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(isAuthorized) && (
                  <Link to="/editgames" className="block">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition">
                      <BarChart3 className="w-6 h-6 text-primary mb-2" />
                      <h4 className="font-semibold">{canManageEvents ? 'Edit Games' : 'View Games'}</h4>
                      <p className="text-sm text-muted-foreground">{canManageEvents ? 'Add, edit, or remove games' : 'Check game status'}</p>
                    </div>
                  </Link>
                )}
                {(isAuthorized) && (
                  <div
                    onClick={() => setActiveTab('expenditures')}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20 transition"
                  >
                    <Wallet className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold">{canManageFinance ? 'Manage Finances' : 'View Finances'}</h4>
                    <p className="text-sm text-muted-foreground">{canManageFinance ? 'Add/view expenditures' : 'Check event costs'}</p>
                  </div>
                )}
                {(isAuthorized) && (
                  <div
                    onClick={() => setActiveTab('schedule')}
                    className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 cursor-pointer hover:bg-secondary/20 transition"
                  >
                    <Calendar className="w-6 h-6 text-secondary mb-2" />
                    <h4 className="font-semibold">{canManageEvents ? 'Edit Schedule' : 'View Schedule'}</h4>
                    <p className="text-sm text-muted-foreground">{canManageEvents ? 'Update event timings' : 'Check event timings'}</p>
                  </div>
                )}
                {canManageRangoli && (
                  <Link to="/rangoli" className="block">
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition">
                      <Plus className="w-6 h-6 text-orange-500 mb-2" />
                      <h4 className="font-semibold">Manage Rangoli</h4>
                      <p className="text-sm text-muted-foreground">Upload & delete photos</p>
                    </div>
                  </Link>
                )}
                {canManageDances && (
                  <Link to="/dances" className="block">
                    <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition">
                      <Plus className="w-6 h-6 text-pink-500 mb-2" />
                      <h4 className="font-semibold">Manage Dances</h4>
                      <p className="text-sm text-muted-foreground">Schedule performances</p>
                    </div>
                  </Link>
                )}
                <div
                  onClick={() => setActiveTab('suggestions')}
                  className="p-4 rounded-xl bg-accent/10 border border-accent/20 cursor-pointer hover:bg-accent/20 transition"
                >
                  <MessageSquare className="w-6 h-6 text-accent mb-2" />
                  <h4 className="font-semibold">Submit Feedback</h4>
                  <p className="text-sm text-muted-foreground">Share your suggestions</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Expenditures Tab */}
          <TabsContent value="expenditures">
            <ExpendituresTab canManage={canManageFinance} />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <ScheduleManageTab canManage={canManageEvents} />
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions">
            <SuggestionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
