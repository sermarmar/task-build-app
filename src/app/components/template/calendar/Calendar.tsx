import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import partyDaysData from '../../../shared/diasFestivos.json';


export const Calendar = () => {

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

    // Día de la semana en que empieza el mes (0=Dom → convertimos a lun-based)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const leadingEmptyDays = (firstDayOfMonth || 7) - 1;

    // Total de días del mes actual y del anterior
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Días del mes siguiente para completar la grid (siempre múltiplo de 7)
    const totalCells = Math.ceil((leadingEmptyDays + daysInMonth) / 7) * 7;
    const trailingDays = totalCells - leadingEmptyDays - daysInMonth;

    const partyDays = new Set(
        partyDaysData.map(({ fecha }) => {
            const [dd, mm, yyyy] = fecha.split('-');
            return `${yyyy}-${mm}-${dd}`;
        })
    );

    const isFestivo = (year: number, month: number, day: number): boolean => {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return partyDays.has(`${year}-${mm}-${dd}`);
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };


    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-around w-full mb-5">
                    <ChevronLeft onClick={handlePrevMonth} />
                    <h2 className="text-lg font-medium text-center">
                        {`${new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).slice(1)}`}
                    </h2>
                    <ChevronRight onClick={handleNextMonth} />
                </div>
                
                <div className="grid grid-cols-7 gap-1 w-full">
                    {days.map((day) => (
                        <div key={day} className="text-center text-sm font-medium flex items-center justify-center text-tertiary-50">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: leadingEmptyDays }, (_, i) => {
                        const day = daysInPrevMonth - leadingEmptyDays + i + 1;
                        return (
                            <div key={`prev-${i}`} className="flex items-center justify-center text-sm relative">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full opacity-30 cursor-pointer hover:opacity-50">
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const dayNum = i + 1;
                        const isToday = new Date(currentYear, currentMonth, dayNum).toDateString() === today.toDateString();
                        const festivo = isFestivo(currentYear, currentMonth, dayNum);

                        return (
                            <div key={i} className="flex items-center justify-center text-sm relative">
                                <span className={`
                                    flex items-center justify-center w-10 h-10 rounded-full
                                    ${isToday
                                        ? 'bg-secondary-600 text-tertiary-50 font-bold'
                                        : festivo
                                            ? 'bg-accent-blossom-400 text-accent-blossom-900 cursor-pointer hover:brightness-110'
                                            : 'bg-primary-300/10 hover:bg-secondary-200 hover:text-primary-950 cursor-pointer'
                                    }
                                `}>
                                    {dayNum}
                                </span>
                            </div>
                        );
                    })}
                    {Array.from({ length: trailingDays }, (_, i) => (
                        <div key={`next-${i}`} className="flex items-center justify-center text-sm relative">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full opacity-30 cursor-pointer hover:opacity-50">
                                {i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}