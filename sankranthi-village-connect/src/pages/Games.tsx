import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Clock, MapPin, Users } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  emoji: string;
  time?: string;
  location?: string;
  participants?: string;
  description: string;
}

const initialGames: Game[] = [
  {
    id: '1',
    name: 'Kite Flying Competition',
    emoji: '🪁',
    time: '9:00 AM - 12:00 PM',
    location: 'Village Ground',
    participants: 'All ages',
    description: 'Show your kite flying skills! Best kite and longest flight wins.',
  },
  {
    id: '2',
    name: 'Rangoli Competition',
    emoji: '🎨',
    time: '7:00 AM - 10:00 AM',
    location: 'Main Street',
    participants: 'Women & Girls',
    description: 'Create beautiful traditional rangoli designs to win prizes.',
  },
  {
    id: '3',
    name: 'Bullock Cart Race',
    emoji: '🐂',
    time: '2:00 PM - 4:00 PM',
    location: 'Village Road',
    participants: 'Farmers',
    description: 'Traditional bullock cart racing - a village favorite!',
  },
  {
    id: '4',
    name: 'Tug of War',
    emoji: '💪',
    time: '4:30 PM - 6:00 PM',
    location: 'Village Ground',
    participants: 'Teams of 10',
    description: 'Test your team strength in this classic village game.',
  },
  {
    id: '5',
    name: 'Pot Breaking (Uriyadi)',
    emoji: '🏺',
    time: undefined,
    location: 'Temple Ground',
    participants: 'Youth',
    description: 'Blindfolded pot breaking challenge with exciting prizes!',
  },
  {
    id: '6',
    name: 'Lemon & Spoon Race',
    emoji: '🍋',
    time: undefined,
    location: 'School Ground',
    participants: 'Children',
    description: 'Fun race for kids - balance the lemon and run!',
  },
  {
    id: '7',
    name: 'Musical Chairs',
    emoji: '🪑',
    time: '11:00 AM - 12:00 PM',
    location: 'Community Hall',
    participants: 'All ages',
    description: 'Classic musical chairs game with surprise gifts.',
  },
  {
    id: '8',
    name: 'Singing Competition',
    emoji: '🎤',
    time: '6:00 PM - 8:00 PM',
    location: 'Stage',
    participants: 'All ages',
    description: 'Showcase your singing talent - folk songs encouraged!',
  },
];

export default function Games() {
  const [games] = useState<Game[]>(initialGames);

  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">🎮</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Festival Games
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🏆</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Exciting games and competitions for all ages. Check timings and participate!
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="glass-card-hover p-6 flex flex-col"
              >
                {/* Game Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-festival mb-4 mx-auto">
                  <span className="text-3xl">{game.emoji}</span>
                </div>

                {/* Game Name */}
                <h3 className="text-lg font-bold text-foreground text-center mb-2">
                  {game.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground text-center mb-4 flex-1">
                  {game.description}
                </p>

                {/* Details */}
                <div className="space-y-2 pt-4 border-t border-border">
                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    {game.time ? (
                      <span className="text-foreground font-medium">{game.time}</span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        ⏳ Will be informed later
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  {game.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="text-muted-foreground">{game.location}</span>
                    </div>
                  )}

                  {/* Participants */}
                  {game.participants && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">{game.participants}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info Note */}
          <div className="mt-10 text-center">
            <div className="glass-card inline-block px-6 py-4">
              <p className="text-sm text-muted-foreground">
                📢 Game timings may change. Stay updated with the committee!
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
