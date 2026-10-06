import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../models/Task";
import type { Status } from "../../../core/models/Status";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/app/components/ux/Badge";
import { cn } from "@/utils/cn";

interface TasksColumnProps {
    status: Status;
    tasks: Task[];
}

export const TasksColumn: React.FC<TasksColumnProps> = ({ status, tasks }) => {
    const { setNodeRef, isOver } = useDroppable({ id: status.id! });

    return (
        <div
            className={cn(
                "flex flex-col flex-1 min-w-[220px] h-full min-h-[24rem] rounded-3xl bg-white/35 shadow-clay-inset p-3 transition-colors duration-150",
                isOver && "bg-tertiary-50/80 ring-2 ring-tertiary-300",
            )}
        >
            <header className="flex items-center justify-between px-2 pt-1 pb-3 shrink-0">
                <h3>
                    <Badge color={status.color} text={status.name} className="text-sm" />
                </h3>
                <span className="min-w-7 rounded-full bg-surface shadow-clay-sm px-2 py-0.5 text-center text-xs font-bold text-primary-600">
                    {tasks.length}
                </span>
            </header>

            <div ref={setNodeRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-primary flex flex-col gap-3 p-1">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary-200 text-primary-400 text-sm font-bold py-8">
                        Suelta aquí una tarea
                    </div>
                )}
            </div>
        </div>
    );
};
