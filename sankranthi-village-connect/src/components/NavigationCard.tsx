import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

interface NavigationCardProps {
  to: string;
  title: string;
  subtitle?: string;
  delay?: number;
}

export function NavigationCard({ to, title, subtitle, delay = 0 }: NavigationCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <Link
      to={to}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="tech-card group block w-full aspect-square relative transition-all duration-200 ease-out"
      style={{
        animationDelay: `${delay}ms`,
        transform: isHovering
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        boxShadow: isHovering ? '0 20px 50px rgba(168, 85, 247, 0.3)' : '',
      }}
    >
      {/* Scanline Effect Container */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-50 mix-blend-overlay scanline-container"></div>

      {/* Glassmorphic Background with Tech Patterns */}
      <div className="absolute inset-0 z-0 bg-slate-950/40 backdrop-blur-md overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Animated Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.2),transparent_60%)] transition-all duration-700"></div>
      </div>

      {/* Animated Edge Light */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 blur-[1px]"></div>

      {/* Content Container */}
      <div className="relative z-20 h-full w-full flex flex-col items-center justify-center p-6">
        {/* Tech Icon Container */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="text-5xl transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            {title === 'Games' && '🎮'}
            {title === 'Rangoli' && '🎨'}
            {title === 'Schedule' && '📅'}
            {title === 'Committee' && '👥'}
            {title === 'Photos' && '📸'}
            {title === 'Judges' && '⚖️'}
            {title === 'Dances' && '💃'}
          </div>
        </div>

        {/* Hover Text Hint */}
        <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-violet-400/80">
            Initialize Module
          </span>
        </div>
      </div>
    </Link>
  );
}
