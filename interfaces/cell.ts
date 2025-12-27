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
  organizers: CellOrganizer[];
  name: string;
  description: string;
  frequency: 'Semanal' | 'Mensal';
  frequencyItems: FrequencyItem[];
  location: string;
  professorId: string;
}

export interface Organizer {
  id?: string;
  studentId: string;
  name: string;
}