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
  position?: 'doelman' | 'veldspeler';
  role?: string;
  photo?: string;
  squad?: 'main' | 'reserve'; // Spelerskern or Reserves
  functions?: string[]; // e.g., ['kapitein', 'voorzitter']
  joinDate?: Date; // Date when player joined the team
}

/**
 * Calculate membership duration in years
 */
function getMembershipYears(joinDate?: Date): number | null {
  if (!joinDate) return null;
  const now = new Date();
  const years = now.getFullYear() - joinDate.getFullYear();
  const monthDiff = now.getMonth() - joinDate.getMonth();
  const dayDiff = now.getDate() - joinDate.getDate();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }
  return years;
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PlayerCard({ member }: { member: TeamMember }) {
  const membershipYears = getMembershipYears(member.joinDate);

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
      <CardHeader className="p-4 space-y-2">
        <CardTitle className="text-lg">{member.name}</CardTitle>
        {member.position && (
          <CardDescription className="capitalize">
            {capitalize(member.position)}
          </CardDescription>
        )}
        {member.functions && member.functions.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {member.functions.map((func) => (
              <span
                key={func}
                className="inline-flex items-center rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold"
              >
                {capitalize(func)}
              </span>
            ))}
          </div>
        )}
        {membershipYears !== null && (
          <CardDescription className="text-xs pt-1">
            Lid sinds {membershipYears} {membershipYears === 1 ? 'jaar' : 'jaar'}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}

export type { TeamMember };
