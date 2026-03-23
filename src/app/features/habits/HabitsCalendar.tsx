import { useState } from "react";
import { HabitDate } from "./HabitDate";

export const HabitsCalendar: React.FC = () => {

    const [date, setDate] = useState<Date>(new Date());

    const handleChangeDay = () => {
        console.log("Cambio de día")
    }
    

    return (
        <>
            <HabitDate day="Lun" numDay={ 23 } isActive={ true } onClick={ handleChangeDay } />
        </>
    );
}