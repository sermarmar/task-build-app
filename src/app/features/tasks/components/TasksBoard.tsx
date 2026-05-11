import { ClipboardList, X } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";
import { useState } from "react";
import { Card, CardBody } from "../../../components/ux/Card";
import { TaskBoardProvider } from "../contexts/TaskBoardProvider";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";
import { TabActionsTask } from "./TabActionsTask";
import { TaskColumns } from "./TaskColumns";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { UpdateTaskService } from "../services/UpdateTaskService";
import { useNotification } from "../../../contexts/notification/useNotification";

const TasksBoardSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-primary-100 p-4 flex flex-col gap-3">
                <SkeletonLine className="w-1/3" />
                {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="rounded-md border-l-4 border-primary-200 p-3 flex gap-3 items-center">
                        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                            <SkeletonLine className="w-2/3" />
                            <SkeletonLine className="w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

export const TasksBoardContent: React.FC = () => {
    const { tasks, statuses, isLoading, error, refreshTasks } = useTaskBoardContext();
    const { notify } = useNotification();

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id as string;
        const newStatusId = over.id as number;
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.status.id === newStatusId) return;
        refreshTasks(true);
        const { error: updateError } = await UpdateTaskService.updateByStatus(taskId, newStatusId);
        if (updateError) {
            notify(<><X /><span>No se pudo mover la tarea.</span></>, 'danger');
            refreshTasks(true);
        }
    };

    return (
        <CardBody className="mt-5 flex-1 min-h-0 flex flex-col">
            {isLoading && <TasksBoardSkeleton />}
            {!isLoading && error && <div className="error">{error.message}</div>}
            {!isLoading && !error && (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <TaskColumns status={statuses} tasks={tasks} />
                </DndContext>
            )}
        </CardBody>
    );
};

const TasksBoardInner: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { editingTask, closeEditModal } = useTaskBoardContext();

    const tabTitle = (
        <div className="flex items-center gap-2">
            <ClipboardList />
            Mis Tareas
        </div>
    );

    return (
        <>
            <Card className="h-full flex flex-col" tabTitle={tabTitle} tabActions={<TabActionsTask onCreateClick={() => setIsCreateModalOpen(true)} />}>
                <TasksBoardContent />
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
