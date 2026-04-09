import { useEffect, useState } from "react";
import { HabitBoardContext } from "./HabitBoardContext";
import type { Habit } from "../models/Habit";
import { RetrieveHabitsService } from "../services/RetrieveHabitsService";
import type { HabitLog } from "../models/HabitLog";
import { RetrieveHabitLogsService } from "../services/RetrieveHabitLogsService";

export const HabitBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
    const [error, setError] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    useEffect(() => {
        const fetchHabits = async () => {
            const result = await RetrieveHabitsService.getHabits(selectedDays);

            if (result.error) {
                setError('Error al cargar los hábitos');
                return;
            }

            setHabits(result.habits);

            const habitLogsResult = await RetrieveHabitLogsService.getHabitLogs(
                selectedDate.toISOString().split('T')[0]
            );

            if (habitLogsResult.error) {
                setError('Error al cargar los hábitos');
                return;
            }

            setHabitLogs(habitLogsResult.habitLogs || []);
        };

        fetchHabits();
    }, [refreshTrigger, selectedDays, selectedDate]);

    const refreshHabits = (cleanStorage?: boolean) => {
        if(cleanStorage) {
            RetrieveHabitsService.removeHabitsFromStorage();
        }
        setRefreshTrigger(prev => prev + 1);
    };

    const selectDay = (day: string[], date: Date) => {
        refreshHabits(true);
        setSelectedDays(day);
        setSelectedDate(date);
    };

    return <HabitBoardContext.Provider value={{habits, habitLogs, error, selectedDate, refreshHabits, selectDay}}>{children}</HabitBoardContext.Provider>;
};