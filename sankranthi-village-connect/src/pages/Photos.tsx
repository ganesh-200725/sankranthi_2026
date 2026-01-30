import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Photos() {
  const { isAuthenticated, hasRole } = useAuth();
  const isCommittee = hasRole(['committee', 'financial_manager', 'event_manager', 'photo_head']);

  // If not authenticated or not committee, show access denied
  if (!isAuthenticated || !isCommittee) {
    return (
      <Layout>
        <section className="section-festival min-h-screen py-8 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="glass-card p-8 md:p-12 max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                🔒 Committee Members Only
              </h1>
              <p className="text-muted-foreground mb-6">
                The photo gallery is only accessible to committee members. 
                These photos are precious memories of our village!
              </p>
              <Link to="/committee">
                <Button className="btn-festival">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Committee
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Committee member view
  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">📸</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Photo Gallery
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🎉</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Precious memories from our village festivals. Committee members only.
            </p>
          </div>

          {/* Coming Soon */}
          <div className="glass-card p-12 text-center max-w-lg mx-auto">
            <span className="text-6xl mb-4 block">📷</span>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Photos Coming Soon!
            </h3>
            <p className="text-muted-foreground mb-4">
              Festival photos will be uploaded here after the event. 
              Check back after Sankranthi 2026!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Secure access for committee members</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
