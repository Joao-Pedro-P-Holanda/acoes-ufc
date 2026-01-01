export interface CellOrganizer {
  id?: string;
  studentId: string;
  name: string;
}

export interface FrequencyItem {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Cell {
  id?: string;
  organizers?: CellOrganizer[];
  name: string;
  description?: string;
  category?: string;
  location?: string;
  professorId?: string | number;
  // Stored in DB as interval (Postgres). Use a string such as '1 week' or ISO duration if needed.
  frequency?: string;
  // Used to build `allocated_times` (public.scheduled_time[])
  frequencyItems?: FrequencyItem[];
  startDate?: string; // 'DD/MM/YYYY'
  endDate?: string;   // 'DD/MM/YYYY'
  allocated_times?: { day: string; start_time: string; end_time: string }[];
  approved?: boolean;
}

export interface Organizer {
  id?: string;
  studentId: string;
  name: string;
}