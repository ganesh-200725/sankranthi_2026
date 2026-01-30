export function Footer() {
  return (
    <footer className="relative py-12 mt-auto border-t border-violet-500/10 overflow-hidden">
      {/* Background Glow for Footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-violet-600/5 blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-violet-500"></div>
            <h3 className="font-bold text-xl text-white tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Sankranthi <span className="text-violet-400">2026</span>
            </h3>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-violet-500"></div>
          </div>

          <p className="text-violet-400/60 text-sm max-w-sm mb-6 font-medium uppercase tracking-[0.2em]">
            Devada Village • Digital Heritage Nexus
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-xl opacity-60">
            <span className="hover:scale-125 transition-transform duration-300 cursor-default grayscale hover:grayscale-0">🪁</span>
            <span className="hover:scale-125 transition-transform duration-300 cursor-default grayscale hover:grayscale-0">🌾</span>
            <span className="hover:scale-125 transition-transform duration-300 cursor-default grayscale hover:grayscale-0">🎨</span>
            <span className="hover:scale-125 transition-transform duration-300 cursor-default grayscale hover:grayscale-0">💃</span>
            <span className="hover:scale-125 transition-transform duration-300 cursor-default grayscale hover:grayscale-0">🎉</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-violet-500/40 uppercase tracking-[0.3em] font-bold">
              © 2026 Village Tech Committee
            </p>
            <p className="text-[10px] text-violet-500/30 uppercase tracking-[0.1em]">
              Precision Engineered for Celebration
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
