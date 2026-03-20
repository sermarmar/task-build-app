import { ClipboardList, Plus } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";

import { useState } from "react";
import { Card, CardBody, CardTitle } from "../../../components/ux/Card";
import { Button } from "../../../components/ux/Button";
import { TasksList } from "./TasksList";
import { TaskBoardProvider } from "../contexts/TaskBoardProvider";

export const TasksBoard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <TaskBoardProvider>
            <Card>
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
                <CardBody className="mt-5">
                    <TasksList />
                </CardBody>
            </Card>
            <ModalCreateTask show={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </ TaskBoardProvider>
    );
}