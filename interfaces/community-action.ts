import TimeString from "@/types/TimeString";

export interface CommunityAction {
  id: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  startTime: TimeString;
  endTime: TimeString;
  frequency?: string;
  contact: string;
  tags: string[];
  location: string;
  isFree?: boolean;
  maxParticipants: number;
  price?: number;
  originalLink?: string;
}


