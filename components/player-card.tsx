import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

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
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        <CardTitle className="text-lg text-gold">{member.name}</CardTitle>
        {member.position && (
          <CardDescription className="capitalize">
            {capitalize(member.position)}
          </CardDescription>
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
