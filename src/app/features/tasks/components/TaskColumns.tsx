import type { Status } from "../models/Status";
import type { Task } from "../models/Task";
import { TasksColumn } from "./TasksColumn";

interface TaskColumnsProps {
    status: Status[];
    tasks: Task[];
}

export const TaskColumns: React.FC<TaskColumnsProps> = ({ status, tasks }) => {

    const activeStates = status.filter(s => s.active);

    const columnsNumber = `grid-cols-${activeStates.length.toString()}`;
    const classes = `grid gap-5 ${columnsNumber}`;
    return (
        <div className={classes}>
            { activeStates.map((state, index) => (
                <TasksColumn key={index} status={state} tasks={tasks.filter(t => t.status.id === state.id)} />
            ))}
        </div>
    );
}