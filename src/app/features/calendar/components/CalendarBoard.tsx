import { Card } from "../../../components/ux/Card";
import { ScrollFadeContainer } from "../../../components/ux/ScrollFadeContainer";
import { Calendar } from "../../../components/template/calendar/Calendar";
import { HabitsList } from "../../habits/components/HabitsList";
import { useHabitBoardContext } from "../../habits/contexts/useHabitBoardContext";
import { DAY_NAMES } from "../../habits/helpers/daysHelpers";

export const CalendarBoard: React.FC = () => {
    const { selectDay } = useHabitBoardContext();

    const handleSelectDate = (date: Date) => {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayName = DAY_NAMES.find(d => d.value === weekday)?.value ?? weekday;
        selectDay([dayName, date.getDate().toString()], date);
    };

    return (
        <Card color="bg-primary-950 text-tertiary-50" className="h-full flex flex-col overflow-hidden">
            <div className="shrink-0">
                <Calendar selectDate={handleSelectDate} />
                <hr className="border-tertiary-50 border rounded-full my-6" />
            </div>
            <ScrollFadeContainer
                className="flex-1 min-h-0"
                fadeColor="var(--color-primary-950)"
            >
                <HabitsList showButton={false}/>
            </ScrollFadeContainer>
        </Card>
    );
};