import { ClipboardList, Plus } from "lucide-react";
import { Button } from "../../components/ux/Button";
import { Card, CardBody, CardTitle } from "../../components/ux/Card"
import { TasksList } from "../tasks/components/TasksList";
import { useState } from "react";
import { HabitsCalendar } from "./HabitsCalendar";

export const HabitsBoard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        
        <Card>
            <CardTitle className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <ClipboardList />
                    Mis rútinas
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
            </CardBody>
        </Card>
    );
}