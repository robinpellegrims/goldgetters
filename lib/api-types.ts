/**
 * API Model Types
 * These types represent the data structure from the API/database
 */

export interface TeamMemberApi {
  id: number;
  name: string;
  jersey_number?: number | null;
  position?: 'doelman' | 'veldspeler' | null;
  role?: string | null;
  photo_url?: string | null;
  squad_type?: 'main' | 'reserve' | null;
  functions?: string[] | null; // e.g., ['kapitein', 'voorzitter']
  join_date?: string | null; // ISO date string
}
