import { useDroppable } from "@dnd-kit/core";
import { Card, CardTitle, CardHeader } from '../../../components/ux/Card';
import { ScrollFadeContainer } from '@/app/components/ux/ScrollFadeContainer';
import type { Task } from "../models/Task";
import type { Status } from "../../../core/models/Status";
import { TaskCard } from "./TaskCard";

interface TasksColumnProps {
    status: Status;
    tasks: Task[];
}

export const TasksColumn: React.FC<TasksColumnProps> = ({ status, tasks }) => {
    const { setNodeRef, isOver } = useDroppable({ id: status.id! });

    return (
        <Card
            className={`h-full flex flex-col transition-colors duration-150 ${isOver ? 'ring-2 ring-primary-400 ring-offset-1' : ''}`}
            color={`bg-${status.color}`}
            withPadding={false}
        >
            <CardHeader className="border-none rounded-t-lg p-4 shrink-0">
                <CardTitle className="text-base">{status.name}</CardTitle>
            </CardHeader>

            <ScrollFadeContainer
                className="flex-1 min-h-0"
                fadeColor={`var(--color-${status.color})`}
            >
                <div ref={setNodeRef} className="flex flex-col gap-4 p-4 min-h-full">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-gray-400 text-sm text-center">
                            Sin tareas
                        </div>
                    )}
                </div>
            </ScrollFadeContainer>
        </Card>
    );
};
