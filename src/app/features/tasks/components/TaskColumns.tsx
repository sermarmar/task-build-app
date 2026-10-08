import type { Status } from "../../../core/models/Status";
import type { Task } from "../models/Task";
import { TasksColumn } from "./TasksColumn";

interface TaskColumnsProps {
    status: Status[];
    tasks: Task[];
}

export const TaskColumns: React.FC<TaskColumnsProps> = ({ status, tasks }) => {
    return (
        <div className="flex gap-4 h-full overflow-x-auto scrollbar-primary pb-2">
            { status.map((state) => (
                <TasksColumn key={state.id} status={state} tasks={tasks.filter(t => t.status?.id === state.id)} />
            ))}
        </div>
    );
}
