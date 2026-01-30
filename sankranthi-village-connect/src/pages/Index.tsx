import { NavigationCard } from '@/components/NavigationCard';
import { Layout } from '@/components/Layout';

const Index = () => {
  return (
    <Layout showFooter={true}>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center pt-32 pb-16 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-violet-500/10 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-violet-500/5 rounded-full animate-spin-reverse-slow"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-violet-200 to-violet-500/50 mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Sankranthi 2026
          </h1>
          <h2 className="text-xl md:text-3xl text-violet-400 font-bold tracking-[0.5em] mb-8 uppercase opacity-80">
            DEVADA VILLAGE
          </h2>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Where tradition meets the future. Experience the spirit of our heritage through the lens of innovation.
          </p>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {/* Games */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <NavigationCard to="/games" title="Games" />
              </div>
              <span className="text-violet-400 font-medium tracking-wide text-lg">Games</span>
            </div>

            {/* Rangoli */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <NavigationCard to="/rangoli" title="Rangoli" />
              </div>
              <span className="text-violet-400 font-medium tracking-wide text-lg">Rangoli</span>
            </div>

            {/* Schedule */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <NavigationCard to="/schedule" title="Schedule" />
              </div>
              <span className="text-violet-400 font-medium tracking-wide text-lg">Schedule</span>
            </div>

            {/* Committee */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <NavigationCard to="/committee" title="Committee" />
              </div>
              <span className="text-violet-400 font-medium tracking-wide text-lg">Committee</span>
            </div>

            {/* Photos */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <NavigationCard to="/photos" title="Photos" />
              </div>
              <span className="text-violet-400 font-medium tracking-wide text-lg">Photos</span>
            </div>

            {/* Judges */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <NavigationCard to="/judges" title="Judges" />
              </div>
              <span className="text-violet-400 font-medium tracking-wide text-lg">Judges</span>
            </div>
          </div>

          {/* Helper text */}
          <p className="text-center text-violet-400/60 text-xs mt-12">
            Click any card above to navigate to that section
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
