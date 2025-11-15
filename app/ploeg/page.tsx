import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ploeg | ZVC Goldgetters',
  description: 'Ontmoet de spelers van ZVC Goldgetters. Bekijk onze volledige spelerslijst met foto\'s en informatie.',
};

interface TeamMember {
  id: number;
  name: string;
  number?: number;
  position?: string;
  role?: string;
  photo?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Robin Pellegrims',
    number: 10,
    position: 'Aanvaller',
    role: 'Speler',
  },
  {
    id: 2,
    name: 'Tom De Baets',
    number: 7,
    position: 'Middenvelder',
    role: 'Speler',
  },
  {
    id: 3,
    name: 'Bart Claes',
    number: 1,
    position: 'Doelman',
    role: 'Speler',
  },
  {
    id: 4,
    name: 'Stef Van Hoof',
    number: 5,
    position: 'Verdediger',
    role: 'Speler',
  },
  {
    id: 5,
    name: 'Koen Hermans',
    number: 11,
    position: 'Aanvaller',
    role: 'Speler',
  },
  {
    id: 6,
    name: 'Wim Goossens',
    number: 8,
    position: 'Middenvelder',
    role: 'Speler',
  },
  {
    id: 7,
    name: 'Peter Claes',
    number: 3,
    position: 'Verdediger',
    role: 'Speler',
  },
  {
    id: 8,
    name: 'Jan Peeters',
    number: 9,
    position: 'Aanvaller',
    role: 'Speler',
  },
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      <div className="aspect-square bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center relative overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            {member.number && (
              <div className="text-8xl font-bold text-gold/30 font-mono mb-2">
                {member.number}
              </div>
            )}
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-gold/40"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        )}
        {member.number && (
          <div className="absolute top-2 right-2 bg-gold text-gold-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            {member.number}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
        {member.position && (
          <p className="text-sm text-muted-foreground">{member.position}</p>
        )}
      </div>
    </div>
  );
}

export default function PloegPage() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gold to-gold/60 bg-clip-text text-transparent">
          Onze Ploeg
        </h1>
        <p className="text-muted-foreground text-lg">
          Maak kennis met de spelers van ZVC Goldgetters
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
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
