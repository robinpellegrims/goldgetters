import { TeamMember } from '@/components/player-card';
import { mockTeamMembers } from './mock-data';

/**
 * Fetches all team members from the data source
 * Currently returns mock data, but can be replaced with API calls
 */
export function getTeamMembers(): TeamMember[] {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/team-members');
  // if (!response.ok) throw new Error('Failed to fetch team members');
  // return response.json();

  return mockTeamMembers;
}

/**
 * Fetches main squad team members (spelerskern)
 */
export function getMainSquad(): TeamMember[] {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/team-members?squad=main');
  // if (!response.ok) throw new Error('Failed to fetch main squad');
  // return response.json();

  return mockTeamMembers.filter((member) => member.squad === 'main');
}

/**
 * Fetches reserve squad team members
 */
export function getReserveSquad(): TeamMember[] {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/team-members?squad=reserve');
  // if (!response.ok) throw new Error('Failed to fetch reserve squad');
  // return response.json();

  return mockTeamMembers.filter((member) => member.squad === 'reserve');
}

/**
 * Fetches a single team member by ID
 * @param id - The team member's ID
 */
export function getTeamMemberById(id: number): TeamMember | undefined {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch(`/api/team-members/${id}`);
  // if (!response.ok) throw new Error('Failed to fetch team member');
  // return response.json();

  return mockTeamMembers.find((member) => member.id === id);
}

// Future async implementation example:
// export async function getTeamMembers(): Promise<TeamMember[]> {
//   const response = await fetch('/api/team-members');
//   if (!response.ok) {
//     throw new Error('Failed to fetch team members');
//   }
//   return response.json();
// }
