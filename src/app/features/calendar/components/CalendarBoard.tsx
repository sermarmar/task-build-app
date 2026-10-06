import { CalendarDays } from "lucide-react";
import { Card } from "../../../components/ux/Card";
import { ScrollFadeContainer } from "../../../components/ux/ScrollFadeContainer";
import { Calendar } from "../../../components/template/calendar/Calendar";
import { HabitsList } from "../../habits/components/HabitsList";
import { useHabitBoardContext } from "../../habits/contexts/useHabitBoardContext";
import { DAY_NAMES } from "../../habits/helpers/daysHelpers";

export const CalendarBoard: React.FC = () => {
    const { selectDay, selectedDate } = useHabitBoardContext();

    const handleSelectDate = (date: Date) => {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayName = DAY_NAMES.find(d => d.value === weekday)?.value ?? weekday;
        selectDay([dayName, date.getDate().toString()], date);
    };

    const selectedLabel = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    const tabTitle = (
        <>
            <CalendarDays />
            Calendario
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle="Consulta tus hábitos de cualquier día">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="rounded-3xl bg-white/40 shadow-clay-inset p-4">
                    <Calendar selectDate={handleSelectDate} />
                </div>
                <div className="flex flex-col min-h-0">
                    <p className="text-sm font-bold text-primary-500 mb-3 first-letter:uppercase">{selectedLabel}</p>
                    <ScrollFadeContainer className="flex-1 min-h-0 max-h-80" fadeColor="var(--color-surface)">
                        <HabitsList showButton={false} />
                    </ScrollFadeContainer>
                </div>
            </div>
        </Card>
    );
};
