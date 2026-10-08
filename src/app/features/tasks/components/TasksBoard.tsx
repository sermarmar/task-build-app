import { ClipboardList, X } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";
import { useState } from "react";
import { Card } from "../../../components/ux/Card";
import { TaskBoardProvider } from "../contexts/TaskBoardProvider";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";
import { TabActionsTask } from "./TabActionsTask";
import { TaskColumns } from "./TaskColumns";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { UpdateTaskService } from "../services/UpdateTaskService";
import { useNotification } from "../../../contexts/notification/useNotification";

const TasksBoardSkeleton: React.FC = () => (
    <div className="flex gap-5 h-full">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-[260px] rounded-3xl bg-white/35 shadow-clay-inset p-4 flex flex-col gap-3">
                <SkeletonLine className="w-1/3" />
                {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="rounded-2xl bg-white/60 p-3 flex gap-3 items-center">
                        <Skeleton className="size-10 rounded-xl shrink-0" />
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
        const { error: updateError } = await UpdateTaskService.updateByStatus(taskId, newStatusId);
        if (updateError) {
            notify(<><X /><span>No se pudo mover la tarea.</span></>, 'danger');
        } else {
            refreshTasks(true);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {isLoading && <TasksBoardSkeleton />}
            {!isLoading && error && <p className="text-sm text-accent-blossom-700">{error.message}</p>}
            {!isLoading && !error && (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <TaskColumns status={statuses} tasks={tasks} />
                </DndContext>
            )}
        </div>
    );
};

const TasksBoardInner: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { editingTask, closeEditModal } = useTaskBoardContext();

    const tabTitle = (
        <>
            <ClipboardList />
            Mis tareas
        </>
    );

    return (
        <>
            <Card tabTitle={tabTitle} tabActions={<TabActionsTask onCreateClick={() => setIsCreateModalOpen(true)} />}>
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
