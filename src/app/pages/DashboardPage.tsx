
import { Navbar } from "../components/template/Navbar";
import { HabitsBoard } from "../features/habits/components/HabitsBoard";
import { Pomodoro } from '../features/Pomodoro';
import { TasksBoard } from "../features/tasks/components/TasksBoard";


export const DashboardPage: React.FC = () => {

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className = "grid grid-cols-5 gap-4 p-4 flex-1 overflow-hidden">
                <div className="col-start-1 row-start-1">
                    <Pomodoro />
                </div>
                <div className="col-start-1 row-start-2">
                    <Pomodoro />
                </div>
                <div className="col-span-2 col-start-2 row-start-1 row-span-2 h-full">
                    <TasksBoard />
                </div>
                <div className="col-span-2 col-start-4 row-start-1 row-span-2 h-full">
                    <HabitsBoard />
                </div>
            </div>
            
        </div>
    );
}