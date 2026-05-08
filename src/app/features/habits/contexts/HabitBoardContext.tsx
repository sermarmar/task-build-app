import { createContext } from "react";
import type { Habit, HabitFilters } from "../models/Habit";
import type { HabitLog } from "../models/HabitLog";

export interface HabitBoardContextType {
    habits: Habit[];
    habitLogs: HabitLog[];
    error: string;
    selectedDate: Date;
    selectDay: (day: string[], date: Date) => void;
    refreshHabits: (cleanStorage?: boolean) => void;
    openModal: (open: boolean, isEdit?: boolean, habit?: Habit) => void;
    filters: HabitFilters;
    setFilters: React.Dispatch<React.SetStateAction<HabitFilters>>;
}

export const HabitBoardContext = createContext<HabitBoardContextType | null>(null);