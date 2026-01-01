export interface ScheduledTime {
    weekday?: number;
    day?: number;
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
    frequency?: string; // stored as ISO 8601 duration (ex: 'P7D', 'P1M', 'P39Y2M20D')
    start_date: Date; 
    end_date: Date;
    allocated_times: ScheduledTime[];
}