import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'Games' },
  { to: '/rangoli', label: 'Rangoli' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/committee', label: 'Committee' },
  { to: '/dances', label: 'Dances' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative backdrop-blur-xl bg-slate-900/80 border-b border-violet-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Tech Pattern Overlay for Header */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #a855f7 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
        <div className="container mx-auto px-4 py-3 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-violet-400/20 blur-md group-hover:animate-pulse"></div>
                <span className="text-xl relative z-10">⚛️</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-white text-lg tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  SANKRANTHI <span className="text-violet-400">2026</span>
                </h1>
                <p className="text-[10px] text-violet-500/70 tracking-[0.2em] font-medium uppercase">Village Tech Festival</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${location.pathname === link.to
                    ? 'text-violet-400 bg-violet-950/50 border border-violet-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'text-slate-400 hover:text-violet-300 hover:bg-violet-950/30 border border-transparent hover:border-violet-500/30'
                    }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {location.pathname === link.to && (
                    <div className="absolute inset-0 bg-violet-400/5 animate-pulse"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* User/Auth Section */}
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-violet-500/30">
                    <User className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-medium text-violet-100">{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-slate-400 hover:text-violet-400 hover:bg-violet-950/30"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : null}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-violet-950/30 border border-transparent hover:border-violet-500/30 transition-colors text-violet-400"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-violet-500/20 animate-fade-in pb-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === link.to
                      ? 'bg-violet-950/50 text-violet-400 border border-violet-500/50'
                      : 'text-slate-400 hover:text-violet-300 hover:bg-violet-950/30'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && user && (
                  <div className="mt-2 pt-2 border-t border-violet-500/20">
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium text-violet-100">{user.username}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-violet-400">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
