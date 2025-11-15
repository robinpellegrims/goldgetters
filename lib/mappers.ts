import { TeamMember } from '@/components/player-card';
import { TeamMemberApi } from './api-types';

/**
 * Maps API team member data to component model
 * @param apiMember - Team member data from API
 * @returns Team member data for components
 */
export function mapTeamMemberFromApi(apiMember: TeamMemberApi): TeamMember {
  return {
    id: apiMember.id,
    name: apiMember.name,
    number: apiMember.jersey_number ?? undefined,
    position: apiMember.position ?? undefined,
    role: apiMember.role ?? undefined,
    photo: apiMember.photo_url ?? undefined,
    squad: apiMember.squad_type ?? undefined,
    functions: apiMember.functions ?? undefined,
    joinDate: apiMember.join_date ? new Date(apiMember.join_date) : undefined,
  };
}

/**
 * Maps an array of API team members to component models
 * @param apiMembers - Array of team member data from API
 * @returns Array of team member data for components
 */
export function mapTeamMembersFromApi(
  apiMembers: TeamMemberApi[],
): TeamMember[] {
  return apiMembers.map(mapTeamMemberFromApi);
}
