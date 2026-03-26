import { useState } from "react";
import { HabitDate } from "./HabitDate";
import { DAY_NAMES, getDays, isSameDay } from "../helpers/daysHelpers";

export const HabitsCalendar: React.FC = () => {

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(today);

    const days = getDays(today, 10);

    const handleChangeDay = () => {
        console.log("Cambio de día")
    }
    

    return (
        <div className="flex gap-3 pb-1 justify-center">
            {days.map((date) => (
                <HabitDate
                key={date.toISOString()}
                day={DAY_NAMES[date.getDay()]}
                numDay={date.getDate()}
                isActive={isSameDay(date, selectedDate)}
                isToday={isSameDay(date, today)}
                onClick={() => setSelectedDate(date)}
                />
            ))}
        </div>
    );
}