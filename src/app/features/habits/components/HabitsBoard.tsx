import { Award } from "lucide-react";
import { Card } from "../../../components/ux/Card"
import { HabitsCalendar } from "./HabitsCalendar";
import { HabitsList } from "./HabitsList";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { TabActionsHabit } from "./TabActionsHabit";

export const HabitsBoardContent: React.FC = () => {
    const { selectedDate } = useHabitBoardContext();
    const selectedLabel = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white/35 shadow-clay-inset p-4 overflow-x-auto scrollbar-primary">
                <HabitsCalendar />
            </div>
            <div>
                <h3 className="font-heading text-lg font-bold text-primary-900 mb-3 first-letter:uppercase">{selectedLabel}</h3>
                <HabitsList className="md:grid-cols-2 2xl:grid-cols-3" />
            </div>
        </div>
    );
};

export const HabitsBoard: React.FC = () => {
    const { openModal } = useHabitBoardContext();

    const tabTitle = (
        <>
            <Award />
            Mis hábitos
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabActions={<TabActionsHabit onCreateClick={() => openModal(true)} />}>
            <HabitsBoardContent />
        </Card>
    );
}
