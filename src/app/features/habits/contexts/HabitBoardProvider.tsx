import { useEffect, useMemo, useState } from "react";
import { HabitBoardContext } from "./HabitBoardContext";
import type { Habit, HabitFilters } from "../models/Habit";
import { DEFAULT_HABIT_FILTERS } from "../models/Habit";
import { filterHabits, RetrieveHabitsService } from "../services/RetrieveHabitsService";
import type { HabitLog } from "../models/HabitLog";
import { RetrieveHabitLogsService } from "../services/RetrieveHabitLogsService";
import { ModalFormHabit } from "../components/ModalFormHabit";
import { DAY_NAMES } from "../helpers/daysHelpers";

const getTodayDays = (): string[] => {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayName = DAY_NAMES.find(d => d.value === weekday)?.value ?? weekday;
    return [dayName, today.getDate().toString()];
};

export const HabitBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allHabits, setAllHabits] = useState<Habit[]>([]);
    const [filters, setFilters] = useState<HabitFilters>(DEFAULT_HABIT_FILTERS);
    const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
    const [error, setError] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDays, setSelectedDays] = useState<string[]>(getTodayDays);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

    useEffect(() => {
        RetrieveHabitsService.removeHabitsFromStorage();
    }, []);

    useEffect(() => {
        const fetchHabits = async () => {
            const result = await RetrieveHabitsService.getHabits(selectedDays);

            if (result.error) {
                setError('Error al cargar los hábitos');
                return;
            }

            setAllHabits(result.habits);

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
        setSelectedDays(day);
        setSelectedDate(date);
    };

    const habits = useMemo(() => filterHabits(allHabits, filters), [allHabits, filters]);

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
        <HabitBoardContext.Provider value={{habits, habitLogs, error, selectedDate, refreshHabits, selectDay, openModal, filters, setFilters}}>
            {children}
            <ModalFormHabit show={isOpenModal} onClose={() => openModal(false)} isEdit={isEdit} habit={selectedHabit} />
        </HabitBoardContext.Provider>
    );
};