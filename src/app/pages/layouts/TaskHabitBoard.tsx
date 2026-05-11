import { useState } from "react";
import { Award, ClipboardList } from "lucide-react";
import { Card } from "@/app/components/ux/Card";
import { TaskBoardProvider } from "@/app/features/tasks/contexts/TaskBoardProvider";
import { HabitBoardProvider } from "@/app/features/habits/contexts/HabitBoardProvider";
import { useTaskBoardContext } from "@/app/features/tasks/contexts/useTaskBoardContext";
import { useHabitBoardContext } from "@/app/features/habits/contexts/useHabitBoardContext";
import { TabActionsTask } from "@/app/features/tasks/components/TabActionsTask";
import { TabActionsHabit } from "@/app/features/habits/components/TabActionsHabit";
import { TasksBoardContent } from "@/app/features/tasks/components/TasksBoard";
import { HabitsBoardContent } from "@/app/features/habits/components/HabitsBoard";
import { ModalCreateTask } from "@/app/features/tasks/components/ModalCreateTask";

const TaskHabitBoardInner: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { editingTask, closeEditModal } = useTaskBoardContext();
    const { openModal } = useHabitBoardContext();

    const tabs = [
        {
            label: <div className="flex items-center gap-2"><ClipboardList />Mis Tareas</div>,
            actions: <TabActionsTask onCreateClick={() => setIsCreateModalOpen(true)} />,
            content: <TasksBoardContent />,
        },
        {
            label: <div className="flex items-center gap-2"><Award />Mis Hábitos</div>,
            actions: <TabActionsHabit onCreateClick={() => openModal(true)} />,
            content: <HabitsBoardContent />,
        },
    ];

    return (
        <>
            <Card className="flex flex-col" tabs={tabs} />
            <ModalCreateTask show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <ModalCreateTask show={!!editingTask} onClose={closeEditModal} task={editingTask} />
        </>
    );
};

export const TaskHabitBoard: React.FC = () => (
    <TaskBoardProvider>
        <HabitBoardProvider>
            <TaskHabitBoardInner />
        </HabitBoardProvider>
    </TaskBoardProvider>
);
