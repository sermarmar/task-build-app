import { DragDropContext } from "@hello-pangea/dnd";
import type { Status } from "../models/Status";
import type { Task } from "../models/Task";
import { TasksColumn } from "./TasksColumn";

interface TaskColumnsProps {
    status: Status[];
    tasks: Task[];
}

export const TaskColumns: React.FC<TaskColumnsProps> = ({ status, tasks }) => {

    const activeStates = status.filter(s => s.active);

    const colsMap: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
    };
    const classes = `grid gap-5 ${colsMap[activeStates.length] ?? 'grid-cols-3'}`;

    const onDragEnd = (result: any) => {
        const { destination, source } = result;
    
        if (!destination) return;

        if (destination.droppableId === source.droppableId) {
            // Reorder within the same column
            const columnTasks = tasks.filter(t => t.status.id.toString() === source.droppableId);
            const [movedTask] = columnTasks.splice(source.index, 1);
            columnTasks.splice(destination.index, 0, movedTask);
        } else {
            // Move to a different column
            const sourceColumnTasks = tasks.filter(t => t.status.id.toString() === source.droppableId);
            const [movedTask] = sourceColumnTasks.splice(source.index, 1);
            movedTask.status = activeStates.find(s => s.id.toString() === destination.droppableId)!;
        }

        
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={classes}>
                { activeStates.map((state, index) => (
                    <TasksColumn key={index} status={state} tasks={tasks.filter(t => t.status.id === state.id)} />
                ))}
            </div>
        </DragDropContext>
        
    );
}