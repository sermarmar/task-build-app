import type { Status } from "../models/Status";
import type { Task } from "../models/Task";
import { TasksColumn } from "./TasksColumn";

interface TaskColumnsProps {
    states: Status[];
    tasks: Task[];
}

export const TaskColumns: React.FC<TaskColumnsProps> = ({ states, tasks }) => {
    const columnsNumber = `grid-cols-${states.length.toString()}`;
    const classes = `grid gap-5 ${columnsNumber}`;
    return (
        <div className={classes}>
            { states.map((state, index) => (
                <TasksColumn key={index} status={state} tasks={tasks.filter(t => t.status === state.name.toLowerCase())} />
            ))}
        </div>
    );
}