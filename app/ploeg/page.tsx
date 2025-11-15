import { Metadata } from 'next';
import { PlayerCard } from '@/components/player-card';
import { getMainSquad, getReserveSquad } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Ploeg | ZVC Goldgetters',
  description: 'Ontmoet de spelers van ZVC Goldgetters. Bekijk onze volledige spelerslijst met foto\'s en informatie.',
};

export default function PloegPage() {
  const mainSquad = getMainSquad();
  const reserveSquad = getReserveSquad();

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

      {/* Main Squad Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Spelerskern</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mainSquad.map((member) => (
            <PlayerCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Reserve Squad Section */}
      {reserveSquad.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Reserves</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reserveSquad.map((member) => (
              <PlayerCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
