import { ClipboardList, Plus } from "lucide-react";
import { Card, CardTitle } from "../../ux/Card";
import { Button } from "../../ux/Button";
import { ModalCreateTask } from "./ModalCreateTask";

import { useState } from "react";

export const TasksCard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Card >
                <CardTitle className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <ClipboardList />
                        Mis Tareas
                    </div>
                    <Button
                        type="button"
                        color="primary"
                        className="text-sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus />
                        Nueva tarea
                    </Button>
                </CardTitle>
            </Card>
            <ModalCreateTask show={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}