import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AIBackground } from './AIBackground';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AIBackground />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-0" />
      <Header />
      <main className="flex-1 pt-20 md:pt-24 relative z-10">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
