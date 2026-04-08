import { createContext } from "react";
import type { Habit } from "../models/Habit";

export interface HabitBoardContextType {
    habits: Habit[];
    error: string;
    selectDay: (day: string[]) => void;
    refreshHabits: (cleanStorage?: boolean) => void;
}

export const HabitBoardContext = createContext<HabitBoardContextType | null>(null);