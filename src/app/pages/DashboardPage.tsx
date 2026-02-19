
import { Navbar } from "../components/template/Navbar";
import { Pomodoro } from '../features/Pomodoro';
import { TasksBoard } from "../features/tasks/components/TasksBoard";


export const DashboardPage: React.FC = () => {

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className = "grid grid-cols-3 gap-4 mt-20 mx-4">
                <div>
                    <Pomodoro />
                </div>
                <div className="col-span-2">
                    <TasksBoard />
                </div>
                
            </div>
        </div>
    );
}