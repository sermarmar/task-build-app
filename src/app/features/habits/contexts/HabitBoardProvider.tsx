import { useEffect, useState } from "react";
import { HabitBoardContext } from "./HabitBoardContext";
import type { Habit } from "../models/Habit";
import { RetrieveHabitsService } from "../services/RetrieveHabitsService";
import type { HabitLog } from "../models/HabitLog";
import { RetrieveHabitLogsService } from "../services/RetrieveHabitLogsService";
import { ModalFormHabit } from "../components/ModalFormHabit";

export const HabitBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
    const [error, setError] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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

    const openModal = (open: boolean, isEdit: boolean = false, habit?: Habit) => {
        setIsOpenModal(open);
        setIsEdit(isEdit);
        if (habit) {
            setSelectedHabit(habit);
        } else {
            setSelectedHabit(null);
        }
    }

    return (
        <HabitBoardContext.Provider value={{habits, habitLogs, error, selectedDate, refreshHabits, selectDay, openModal}}>
            {children}
            <ModalFormHabit show={isOpenModal} onClose={() => openModal(false)} isEdit={isEdit} habit={selectedHabit} />
        </HabitBoardContext.Provider>
    );
};