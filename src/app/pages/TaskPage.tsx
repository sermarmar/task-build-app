import { TaskHabitBoard } from "./layouts/TaskHabitBoard";

export const TaskPage: React.FC = () => {
    return (
        <div className="h-[calc(100vh-80px)]">
            <TaskHabitBoard />
        </div>
    );
}