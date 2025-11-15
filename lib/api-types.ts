/**
 * API Model Types
 * These types represent the data structure from the API/database
 */

export interface TeamMemberApi {
  id: number;
  name: string;
  jersey_number?: number | null;
  position?: string | null;
  role?: string | null;
  photo_url?: string | null;
  squad_type?: 'main' | 'reserve' | null;
}
