import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TeamMember {
  id: number;
  name: string;
  number?: number;
  position?: string;
  role?: string;
  photo?: string;
  squad?: 'main' | 'reserve'; // Spelerskern or Reserves
}

export function PlayerCard({ member }: { member: TeamMember }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
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
      </CardContent>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{member.name}</CardTitle>
        {member.position && (
          <CardDescription>{member.position}</CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}

export type { TeamMember };
