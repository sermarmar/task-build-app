import { Award } from "lucide-react";
import { Card, CardBody } from "../../../components/ux/Card"
import { HabitsCalendar } from "./HabitsCalendar";
import { HabitsList } from "./HabitsList";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { TabActionsHabit } from "./TabActionsHabit";

export const HabitsBoardContent: React.FC = () => (
    <CardBody className="mt-2">
        <HabitsCalendar />
        <hr className="invisible my-3" />
        <HabitsList />
    </CardBody>
);

export const HabitsBoard: React.FC = () => {
    const { openModal } = useHabitBoardContext();

    const tabTitle = (
        <div className="flex gap-2 items-center">
            <Award />
            Mis hábitos
        </div>
    );

    return (
        <Card className="h-full flex flex-col" tabTitle={tabTitle} tabActions={<TabActionsHabit onCreateClick={() => openModal(true)} />}>
            <HabitsBoardContent />
        </Card>
    );
}