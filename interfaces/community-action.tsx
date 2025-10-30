export interface CommunityAction {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  frequency?: string;
  contact: string;
  tags: string[];
  location: string;
  isFull?: boolean;
  maxParticipants: number;
  price?: number;
  originalLink?: string;
  latitude?: number;
  longitude?: number;
}


