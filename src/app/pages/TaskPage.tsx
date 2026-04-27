import { HabitsBoard } from "../features/habits/components/HabitsBoard";
import { HabitBoardProvider } from "../features/habits/contexts/HabitBoardProvider";
import { TasksBoard } from "../features/tasks/components/TasksBoard";

export const TaskPage: React.FC = () => {
    return (
        <div className = "grid grid-cols-2 gap-6">
            <div>
                <TasksBoard />
            </div>
            <div>
                <HabitBoardProvider>
                    <HabitsBoard />
                </HabitBoardProvider>
            </div>
        </div>
    );
}