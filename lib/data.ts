import { TeamMember } from '@/components/player-card';
import { mockTeamMembersApi } from './mock-data';
import { mapTeamMembersFromApi, mapTeamMemberFromApi } from './mappers';

/**
 * Fetches all team members from the data source
 * Currently returns mock data, but can be replaced with API calls
 */
export function getTeamMembers(): TeamMember[] {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/team-members');
  // if (!response.ok) throw new Error('Failed to fetch team members');
  // const apiData = await response.json();
  // return mapTeamMembersFromApi(apiData);

  return mapTeamMembersFromApi(mockTeamMembersApi);
}

/**
 * Fetches main squad team members (spelerskern)
 */
export function getMainSquad(): TeamMember[] {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/team-members?squad=main');
  // if (!response.ok) throw new Error('Failed to fetch main squad');
  // const apiData = await response.json();
  // return mapTeamMembersFromApi(apiData);

  const mainSquadApi = mockTeamMembersApi.filter(
    (member) => member.squad_type === 'main'
  );
  return mapTeamMembersFromApi(mainSquadApi);
}

/**
 * Fetches reserve squad team members
 */
export function getReserveSquad(): TeamMember[] {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/team-members?squad=reserve');
  // if (!response.ok) throw new Error('Failed to fetch reserve squad');
  // const apiData = await response.json();
  // return mapTeamMembersFromApi(apiData);

  const reserveSquadApi = mockTeamMembersApi.filter(
    (member) => member.squad_type === 'reserve'
  );
  return mapTeamMembersFromApi(reserveSquadApi);
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
  // const apiData = await response.json();
  // return mapTeamMemberFromApi(apiData);

  const apiMember = mockTeamMembersApi.find((member) => member.id === id);
  return apiMember ? mapTeamMemberFromApi(apiMember) : undefined;
}

// Future async implementation example:
// export async function getTeamMembers(): Promise<TeamMember[]> {
//   const response = await fetch('/api/team-members');
//   if (!response.ok) {
//     throw new Error('Failed to fetch team members');
//   }
//   return response.json();
// }
