export interface DayActivity {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface WeekActivity {
    days: (DayActivity | null)[];
    monthLabel?: { label: string; colSpan: number } | null;
}

export interface ActivityGrid {
    weeks: WeekActivity[];
    months: { label: string; weekIndex: number }[];
    totalCount: number;
}
