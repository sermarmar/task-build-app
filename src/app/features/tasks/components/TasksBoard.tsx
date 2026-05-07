import { ClipboardList, Plus } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";
import { useState } from "react";
import { Card, CardBody } from "../../../components/ux/Card";
import { Button } from "../../../components/ux/Button";
import { TasksList } from "./TasksList";
import { TaskBoardProvider } from "../contexts/TaskBoardProvider";
import { Input } from "@/app/components/ux/Input";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";

const TasksBoardInner: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { editingTask, closeEditModal } = useTaskBoardContext();

    const tabTitle = (
        <div className="flex items-center gap-2">
            <ClipboardList />
            Mis Tareas
        </div>
    );

    const tabActions = (
        <div className="flex gap-2 items-center">
            <Input name="Buscar" type="text" size="sm" placeholder="Buscar tareas..." />
            <Button
                type="button"
                color="primary"
                form="pill"
                className="text-sm"
                onClick={() => setIsCreateModalOpen(true)}
            >
                <Plus />
            </Button>
        </div>
    );

    return (
        <>
            <Card className="h-full flex flex-col" tabTitle={tabTitle} tabActions={tabActions}>
                <CardBody className="mt-5">
                    <TasksList />
                </CardBody>
            </Card>
            <ModalCreateTask show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <ModalCreateTask show={!!editingTask} onClose={closeEditModal} task={editingTask} />
        </>
    );
};

export const TasksBoard: React.FC = () => (
    <TaskBoardProvider>
        <TasksBoardInner />
    </TaskBoardProvider>
);
