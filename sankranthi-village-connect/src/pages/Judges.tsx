import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, LogIn, Eye, EyeOff, Shield, Palette, Music, Save } from 'lucide-react';
import { toast } from 'sonner';

interface RangoliScore {
  participantId: string;
  score: number;
}

interface DanceScore {
  teamName: string;
  score: number;
}

const API_URL = 'http://localhost:5000';

export default function Judges() {
  const { isAuthenticated, user, login, hasRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const [rangoliScores, setRangoliScores] = useState<RangoliScore[]>([]);
  const [danceScores, setDanceScores] = useState<DanceScore[]>([]);

  const isJudge = hasRole(['judge']);

  const fetchData = async () => {
    if (!isAuthenticated || !isJudge) return;
    try {
      // 1. Fetch live data
      const [rangoliRes, danceRes] = await Promise.all([
        fetch(`${API_URL}/rangoli`),
        fetch(`${API_URL}/dance-teams`)
      ]);
      const rangoliData = await rangoliRes.json();
      const danceData = await danceRes.json();

      // 2. Fetch existing scores for this judge
      const [rScoresRes, dScoresRes] = await Promise.all([
        fetch(`${API_URL}/scores/rangoli`, { headers: { 'Authorization': `Bearer ${user?.token}` } }),
        fetch(`${API_URL}/scores/dance`, { headers: { 'Authorization': `Bearer ${user?.token}` } })
      ]);
      const rScores = await rScoresRes.json();
      const dScores = await dScoresRes.json();

      // 3. Map into state
      setRangoliScores(rangoliData.map((r: any) => {
        const saved = rScores.find((s: any) => s.targetId === r.participantId);
        return { participantId: r.participantId, score: saved ? saved.score : 0 };
      }));

      setDanceScores(danceData.map((d: any) => {
        const saved = dScores.find((s: any) => s.targetId === d.id);
        return { teamName: d.name, teamId: d.id, score: saved ? saved.score : 0 };
      }));
    } catch {
      toast.error('Failed to load live data');
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, isAuthenticated, isJudge]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginData.username, loginData.password, 'judge');

    if (result.success) {
      toast.success('Welcome, Judge! You can now submit scores.');
    } else {
      toast.error(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  const handleRangoliScoreChange = (id: string, score: number) => {
    setRangoliScores(scores =>
      scores.map(s => s.participantId === id ? { ...s, score: Math.min(10, Math.max(0, score)) } : s)
    );
  };

  const handleDanceScoreChange = (name: string, score: number) => {
    setDanceScores(scores =>
      scores.map(s => s.teamName === name ? { ...s, score: Math.min(10, Math.max(0, score)) } : s)
    );
  };

  const handleSaveScores = async (type: 'rangoli' | 'dance') => {
    const scoresToSave = type === 'rangoli'
      ? rangoliScores.map(s => ({ targetId: s.participantId, score: s.score }))
      : danceScores.map(s => ({ targetId: (s as any).teamId, score: s.score }));

    try {
      const res = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ type, scores: scoresToSave })
      });

      if (!res.ok) throw new Error('Failed to save');
      toast.success(`${type === 'rangoli' ? 'Rangoli' : 'Dance'} scores saved successfully!`);
    } catch {
      toast.error('Failed to save scores to backend');
    }
  };

  // If not authenticated or not a judge
  if (!isAuthenticated || !isJudge) {
    return (
      <Layout>
        <section className="section-festival min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl animate-float">⚖️</span>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                  Judges Portal
                </h1>
                <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🔐</span>
              </div>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Exclusive access for competition judges only
              </p>
            </div>

            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Judges Login</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your judge credentials to access scoring
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Judge Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-secondary hover:bg-secondary/90"
                  disabled={isLoading}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {isLoading ? 'Logging in...' : 'Login as Judge'}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Committee members cannot access this portal
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Judge Dashboard
  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">⚖️</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Welcome, {user?.username}!
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Judges Scoring Portal • Submit your scores fairly
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/20">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">Judge Access</span>
              </div>
            </div>
          </div>

          {/* Scoring Tabs */}
          <Tabs defaultValue="rangoli" className="space-y-6">
            <TabsList className="glass-card h-auto p-2 flex flex-wrap gap-2">
              <TabsTrigger value="rangoli" className="gap-2">
                <Palette className="w-4 h-4" />
                Rangoli Scoring
              </TabsTrigger>
              <TabsTrigger value="dance" className="gap-2">
                <Music className="w-4 h-4" />
                Dance Scoring
              </TabsTrigger>
            </TabsList>

            {/* Rangoli Scoring */}
            <TabsContent value="rangoli">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  🎨 Rangoli Competition Scores
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter scores from 0-10 for each participant based on creativity, colors, and design.
                </p>

                <div className="space-y-4">
                  {rangoliScores.map((entry) => (
                    <div key={entry.participantId} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center">
                        <span className="text-xl">🎨</span>
                      </div>
                      <div className="flex-1">
                        <Label className="text-foreground font-medium">
                          Participant ID: {entry.participantId}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={entry.score}
                          onChange={(e) => handleRangoliScoreChange(entry.participantId, parseInt(e.target.value) || 0)}
                          className="w-20 text-center font-bold"
                        />
                        <span className="text-muted-foreground">/ 10</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => handleSaveScores('rangoli')} className="mt-6 btn-festival">
                  <Save className="w-4 h-4 mr-2" />
                  Save Rangoli Scores
                </Button>
              </div>
            </TabsContent>

            {/* Dance Scoring */}
            <TabsContent value="dance">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  💃 Dance Competition Scores
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter scores from 0-10 for each dance team based on performance, choreography, and presentation.
                </p>

                <div className="space-y-4">
                  {danceScores.map((entry) => (
                    <div key={entry.teamName} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center">
                        <span className="text-xl">💃</span>
                      </div>
                      <div className="flex-1">
                        <Label className="text-foreground font-medium">
                          {entry.teamName}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={entry.score}
                          onChange={(e) => handleDanceScoreChange(entry.teamName, parseInt(e.target.value) || 0)}
                          className="w-20 text-center font-bold"
                        />
                        <span className="text-muted-foreground">/ 10</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => handleSaveScores('dance')} className="mt-6 btn-festival">
                  <Save className="w-4 h-4 mr-2" />
                  Save Dance Scores
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 glass-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 Your scores are confidential and secure. Only judges can access this portal.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
