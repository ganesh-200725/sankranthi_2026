import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { LogIn, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

// Committee Dashboard Components
import { CommitteeDashboard } from '@/components/committee/CommitteeDashboard';

export default function Committee() {
  const { isAuthenticated, user, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent, loginType: 'committee' | 'judge') => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginData.username, loginData.password, loginType);

    if (result.success) {
      toast.success('Welcome! Login successful');
      if (loginType === 'judge') {
        navigate('/judges');
      }
    } else {
      toast.error(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  // If authenticated and committee member, show dashboard
  const waterBgStyle: React.CSSProperties = {
    backgroundImage: 'url(https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -2,
    overflow: 'hidden',
    filter: 'brightness(0.7) saturate(1.2)',
  };

  if (isAuthenticated && user && user.role !== 'judge') {
    return (
      <Layout>
        <CommitteeDashboard />
      </Layout>
    );
  }

  // Login form for non-authenticated users
  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">👥</span>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Committee Portal
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🔐</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Login to access committee features or judge portal
            </p>
          </div>

          {/* Login Tabs */}
          <div className="max-w-md mx-auto">
            <div className="glass-card p-6 md:p-8">
              <Tabs defaultValue="committee" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="committee" className="gap-2">
                    <Users className="w-4 h-4" />
                    Committee
                  </TabsTrigger>
                  <TabsTrigger value="judge" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Judges
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="committee">
                  <form onSubmit={(e) => handleLogin(e, 'committee')} className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg mx-auto mb-3">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">Committee Login</h3>
                      <p className="text-sm text-muted-foreground">
                        For committee members, finance & event managers
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                        className="h-12 bg-slate-900/50 border-violet-500/20 focus:border-violet-500/50"
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
                          className="h-12 pr-12 bg-slate-900/50 border-violet-500/20 focus:border-violet-500/50"
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
                      className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
                      disabled={isLoading}
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="judge">
                  <form onSubmit={(e) => handleLogin(e, 'judge')} className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg mx-auto mb-3">
                        <Shield className="w-8 h-8 text-violet-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Judges Login</h3>
                      <p className="text-sm text-muted-foreground">
                        Exclusive access for competition judges
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="judge-username">Username</Label>
                      <Input
                        id="judge-username"
                        placeholder="Enter judge username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                        className="h-12 bg-slate-900/50 border-violet-500/20 focus:border-violet-500/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="judge-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="judge-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter judge password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                          className="h-12 pr-12 bg-slate-900/50 border-violet-500/20 focus:border-violet-500/50"
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
                      className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white"
                      disabled={isLoading}
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      {isLoading ? 'Logging in...' : 'Login as Judge'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Demo credentials hint */}
              <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 text-center">
                <p className="text-xs text-violet-400/80 mb-2">
                  🔑 System Access Tokens
                </p>
                <div className="text-[10px] space-y-1 text-violet-400/60 uppercase tracking-widest font-bold">
                  <p>CMD: <code className="bg-violet-500/10 px-1 rounded text-violet-300">committee1 / sankranthi2026</code></p>
                  <p>FIN: <code className="bg-violet-500/10 px-1 rounded text-violet-300">finance / finance2026</code></p>
                  <p>EVT: <code className="bg-violet-500/10 px-1 rounded text-violet-300">events / events2026</code></p>
                  <p>JDG: <code className="bg-violet-500/10 px-1 rounded text-violet-300">judge1 / judge2026</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
