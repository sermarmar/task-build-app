import { ClipboardList } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";
import { useState } from "react";
import { Card, CardBody } from "../../../components/ux/Card";
import { TasksList } from "./TasksList";
import { TaskBoardProvider } from "../contexts/TaskBoardProvider";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";
import { TabActionsTask } from "./TabActionsTask";

const TasksBoardInner: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { editingTask, closeEditModal } = useTaskBoardContext();

    const tabTitle = (
        <div className="flex items-center gap-2">
            <ClipboardList />
            Mis Tareas
        </div>
    );

    const tabActions = <TabActionsTask onCreateClick={() => setIsCreateModalOpen(true)} />;

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
