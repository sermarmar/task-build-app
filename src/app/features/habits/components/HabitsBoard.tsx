import { Award } from "lucide-react";
import { Card, CardBody } from "../../../components/ux/Card"
import { HabitsCalendar } from "./HabitsCalendar";
import { HabitsList } from "./HabitsList";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";
import { TabActionsHabit } from "./TabActionsHabit";

export const HabitsBoard: React.FC = () => {
    const { openModal } = useHabitBoardContext();

    const tabTitle = (
        <div className="flex gap-2 items-center">
            <Award />
            Mis hábitos
        </div>
    );

    const tabActions = <TabActionsHabit onCreateClick={() => openModal(true)} />;

    return (
        <Card className="h-full flex flex-col" tabTitle={tabTitle} tabActions={tabActions}>
            <CardBody className="mt-5">
                <HabitsCalendar />
                <HabitsList />
            </CardBody>
        </Card>
    );
}