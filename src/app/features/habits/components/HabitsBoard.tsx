import { Award, Plus } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody, CardTitle } from "../../../components/ux/Card"
import { useState } from "react";
import { HabitsCalendar } from "./HabitsCalendar";
import { ModalCreateHabit } from "./ModalCreateHabit";
import { HabitBoardProvider } from "../contexts/HabitBoardProvider";
import { HabitsList } from "./HabitsList";

export const HabitsBoard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <HabitBoardProvider>
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
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus />
                    </Button>
                </CardTitle>
                <CardBody className="mt-5">
                    <HabitsCalendar />
                    <HabitsList />
                </CardBody>
            </Card>
            <ModalCreateHabit show={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </ HabitBoardProvider>
    );
}