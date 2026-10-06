import { PageHeader } from "../components/template/PageHeader";
import { TaskHabitBoard } from "./layouts/TaskHabitBoard";

export const TaskPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 flex-1 min-h-0">
            <PageHeader
                title="Tareas y hábitos"
                subtitle="Organiza tu trabajo y cuida tus rutinas desde un mismo sitio."
            />
            <TaskHabitBoard />
        </div>
    );
}
