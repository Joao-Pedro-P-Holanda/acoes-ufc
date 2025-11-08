import type { Duration } from "date-fns";

export interface ScheduledTime {
    weekday: number;
    start_time: string; 
    end_time: string;
}

export interface ExtracurricularGroup {
    id: number;
    name: string;
    description?: string;
    category?: string;
    location?: string;
    responsible_professor_id: number;
    frequency?: Duration;
    start_date: Date; 
    end_date: Date;
    allocated_times: ScheduledTime[];
}