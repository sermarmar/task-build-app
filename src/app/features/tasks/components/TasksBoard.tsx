import { ClipboardList, X } from "lucide-react";
import { ModalCreateTask } from "./ModalCreateTask";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "../../../components/ux/Card";
import { TaskBoardProvider } from "../contexts/TaskBoardProvider";
import { useTaskBoardContext } from "../contexts/useTaskBoardContext";
import { TabActionsTask } from "./TabActionsTask";
import { TaskColumns } from "./TaskColumns";
import { TaskCardView } from "./TaskCard";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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

    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const activeTask = tasks.find(t => t.id === activeTaskId);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const handleDragStart = (event: DragStartEvent) => setActiveTaskId(event.active.id as string);

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveTaskId(null);
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
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setActiveTaskId(null)}
                >
                    <TaskColumns status={statuses} tasks={tasks} />
                    {/* Portal al body: dentro de las columnas (con scroll propio) la tarjeta quedaba recortada y por debajo */}
                    {createPortal(
                        <DragOverlay dropAnimation={null}>
                            {activeTask && (
                                <TaskCardView task={activeTask} className="shadow-clay rotate-2 cursor-grabbing" />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
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
