import { useEffect, useState } from "react";
import { HabitBoardContext } from "./HabitBoardContext";
import type { Habit } from "../models/Habit";
import { RetrieveHabitsService } from "../services/RetrieveHabitsService";

export const HabitBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [error, setError] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const result = await RetrieveHabitsService.getHabits(selectedDays);
            if (result.error) {
                setError(result.error);
            } else {
                setHabits(result.habits);
            }
        };

        fetchTasks();
    }, [refreshTrigger, selectedDays]);

    const refreshHabits = (cleanStorage?: boolean) => {
        if(cleanStorage) {
            RetrieveHabitsService.removeHabitsFromStorage();
        }
        setRefreshTrigger(prev => prev + 1);
    };

    const selectDay = (day: string[]) => {
        refreshHabits(true);
        setSelectedDays(day);
    };

    return <HabitBoardContext.Provider value={{habits, error, refreshHabits, selectDay}}>{children}</HabitBoardContext.Provider>;
};