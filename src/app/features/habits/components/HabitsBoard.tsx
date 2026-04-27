import { Award, Plus } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody, CardTitle } from "../../../components/ux/Card"
import { HabitsCalendar } from "./HabitsCalendar";
import { HabitsList } from "./HabitsList";
import { useHabitBoardContext } from "../contexts/useHabitBoardContext";

export const HabitsBoard: React.FC = () => {
    const { openModal } = useHabitBoardContext();

    return (
        <Card className="h-full flex flex-col">
            <CardTitle className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <Award />
                    Mis hábitos
                </div>
                <Button
                    type="button"
                    color="primary"
                    className="text-sm"
                    onClick={() => openModal(true)}
                >
                    <Plus />
                </Button>
            </CardTitle>
            <CardBody className="mt-5">
                <HabitsCalendar />
                <HabitsList />
            </CardBody>
        </Card>
    );
}