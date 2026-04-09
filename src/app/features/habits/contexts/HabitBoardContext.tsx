import { createContext } from "react";
import type { Habit } from "../models/Habit";
import type { HabitLog } from "../models/HabitLog";

export interface HabitBoardContextType {
    habits: Habit[];
    habitLogs: HabitLog[]; // Deberías definir un tipo específico para los logs de hábitos
    error: string;
    selectedDate: Date;
    selectDay: (day: string[], date: Date) => void;
    refreshHabits: (cleanStorage?: boolean) => void;
}

export const HabitBoardContext = createContext<HabitBoardContextType | null>(null);