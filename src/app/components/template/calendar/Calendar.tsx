import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import partyDaysData from '../../../shared/diasFestivos.json';
import { cn } from "@/utils/cn";

interface CalendarProps {
    selectDate?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectDate }) => {

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
    const [selectedMonthYear, setSelectedMonthYear] = useState<string>(`${today.getFullYear()}-${today.getMonth()}`);
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Día de la semana en que empieza el mes (0=Dom → convertimos a lun-based)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const leadingEmptyDays = (firstDayOfMonth || 7) - 1;

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

    const handleDayClick = (dayNum: number) => {
        const date = new Date(currentYear, currentMonth, dayNum);
        setSelectedDay(dayNum);
        setSelectedMonthYear(`${currentYear}-${currentMonth}`);
        selectDate?.(date);
    };

    const isSelected = (dayNum: number): boolean =>
        selectedDay === dayNum && selectedMonthYear === `${currentYear}-${currentMonth}`;

    const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    const navButton = "size-9 rounded-full clay-knob flex items-center justify-center text-primary-600 hover:text-tertiary-600 transition cursor-pointer";
    const outsideDay = "flex items-center justify-center size-9 rounded-full text-primary-300";

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between w-full mb-4">
                <button type="button" aria-label="Mes anterior" onClick={handlePrevMonth} className={navButton}>
                    <ChevronLeft size={18} />
                </button>
                <h3 className="font-heading text-base font-bold text-primary-900 first-letter:uppercase">
                    {monthLabel}
                </h3>
                <button type="button" aria-label="Mes siguiente" onClick={handleNextMonth} className={navButton}>
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 w-full justify-items-center">
                {days.map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-primary-400 py-1">
                        {day}
                    </div>
                ))}
                {Array.from({ length: leadingEmptyDays }, (_, i) => (
                    <span key={`prev-${i}`} className={outsideDay}>
                        {daysInPrevMonth - leadingEmptyDays + i + 1}
                    </span>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const dayNum = i + 1;
                    const isToday = new Date(currentYear, currentMonth, dayNum).toDateString() === today.toDateString();
                    const festivo = isFestivo(currentYear, currentMonth, dayNum);
                    const selected = isSelected(dayNum);

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleDayClick(dayNum)}
                            aria-pressed={selected}
                            className={cn(
                                "flex items-center justify-center size-9 rounded-full text-sm font-bold cursor-pointer transition-all",
                                isToday
                                    ? "clay-peach text-white shadow-clay-pressed"
                                    : festivo
                                        ? "bg-accent-blossom-200 text-accent-blossom-800 hover:bg-accent-blossom-300"
                                        : "text-primary-700 hover:bg-white hover:shadow-clay-sm",
                                selected && !isToday && "clay-knob text-tertiary-600",
                            )}
                        >
                            {dayNum}
                        </button>
                    );
                })}
                {Array.from({ length: trailingDays }, (_, i) => (
                    <span key={`next-${i}`} className={outsideDay}>
                        {i + 1}
                    </span>
                ))}
            </div>
        </div>
    );
}
