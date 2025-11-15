import { Metadata } from 'next';
import { PlayerCard, TeamMember } from '@/components/player-card';

export const metadata: Metadata = {
  title: 'Ploeg | ZVC Goldgetters',
  description: 'Ontmoet de spelers van ZVC Goldgetters. Bekijk onze volledige spelerslijst met foto\'s en informatie.',
};

// TODO: Replace with API call
// Example: const teamMembers = await fetch('/api/team-members').then(res => res.json());
import { getTeamMembers } from '@/data/team-members';

export default function PloegPage() {
  const teamMembers = getTeamMembers();

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gold">
          Onze Ploeg
        </h1>
        <p className="text-muted-foreground text-lg">
          Maak kennis met de spelers van ZVC Goldgetters
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <PlayerCard key={member.id} member={member} />
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-muted/50 border">
        <h2 className="text-2xl font-semibold mb-3">Word lid van onze ploeg!</h2>
        <p className="text-muted-foreground mb-4">
          Ben je geïnteresseerd om met ons mee te spelen? Neem contact met ons op
          voor meer informatie over trainingen en wedstrijden.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
        >
          Contacteer ons
        </a>
      </div>
    </div>
  );
}
