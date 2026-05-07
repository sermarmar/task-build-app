import { Award, Plus } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody } from "../../../components/ux/Card"
import { HabitsCalendar } from "./HabitsCalendar";
import { HabitsList } from "./HabitsList";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";

export const HabitsBoard: React.FC = () => {
    const { openModal } = useHabitBoardContext();

    const tabTitle = (
        <div className="flex gap-2 items-center">
            <Award />
            Mis hábitos
        </div>
    );

    const tabActions = (
        <>
            <Button
                type="button"
                color="primary"
                className="text-sm"
                form="pill"
                onClick={() => openModal(true)}
            >
                <Plus />
            </Button>
        </>
    );

    return (
        <Card className="h-full flex flex-col" tabTitle={tabTitle} tabActions={tabActions}>
            <CardBody className="mt-5">
                <HabitsCalendar />
                <HabitsList />
            </CardBody>
        </Card>
    );
}