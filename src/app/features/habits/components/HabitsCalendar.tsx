import { useState } from "react";
import { HabitDate } from "./HabitDate";
import { DAY_NAMES, getDays, isSameDay } from "../helpers/daysHelpers";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";

export const HabitsCalendar: React.FC = () => {

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const { selectDay } = useHabitBoardContext();

    const days = getDays(today, 10);

    const handleChangeDay = (date: Date) => {
        const days = DAY_NAMES.filter(d => d.value === date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()).map(d => d.value);
        days.push(date.getDate().toString());

        setSelectedDate(date);
        selectDay(days);
    }
    

    return (
        <div className="flex gap-3 pb-1 justify-center">
            {days.map((date) => (
                <HabitDate
                key={date.toISOString()}
                day={DAY_NAMES.find(d => d.value === date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())?.label || date.getDate().toString()}
                numDay={date.getDate()}
                isActive={isSameDay(date, selectedDate)}
                isToday={isSameDay(date, today)}
                onClick={() => handleChangeDay(date)}
                />
            ))}
        </div>
    );
}