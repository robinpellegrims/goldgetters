import { TeamMember } from '@/components/player-card';

// TODO: Replace this with actual API/database calls
// This is temporary mock data for development

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

export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}

// Future: async function to fetch from API
// export async function getTeamMembers(): Promise<TeamMember[]> {
//   const response = await fetch('/api/team-members');
//   return response.json();
// }
