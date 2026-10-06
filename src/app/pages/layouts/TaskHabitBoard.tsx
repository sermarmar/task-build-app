import { useState } from "react";
import { Award, ClipboardList } from "lucide-react";
import { SegmentedControl } from "@/app/components/ux/SegmentedControl";
import { TaskBoardProvider } from "@/app/features/tasks/contexts/TaskBoardProvider";
import { HabitBoardProvider } from "@/app/features/habits/contexts/HabitBoardProvider";
import { useTaskBoardContext } from "@/app/features/tasks/contexts/useTaskBoardContext";
import { useHabitBoardContext } from "@/app/features/habits/contexts/useHabitBoardContext";
import { TabActionsTask } from "@/app/features/tasks/components/TabActionsTask";
import { TabActionsHabit } from "@/app/features/habits/components/TabActionsHabit";
import { TasksBoardContent } from "@/app/features/tasks/components/TasksBoard";
import { HabitsBoardContent } from "@/app/features/habits/components/HabitsBoard";
import { ModalCreateTask } from "@/app/features/tasks/components/ModalCreateTask";

type BoardTab = 'tasks' | 'habits';

const TAB_OPTIONS: { value: BoardTab; label: React.ReactNode }[] = [
    { value: 'tasks',  label: <><ClipboardList />Mis tareas</> },
    { value: 'habits', label: <><Award />Mis hábitos</> },
];

const TaskHabitBoardInner: React.FC = () => {
    const [activeTab, setActiveTab] = useState<BoardTab>('tasks');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { editingTask, closeEditModal } = useTaskBoardContext();
    const { openModal } = useHabitBoardContext();

    return (
        <section className="flex flex-col gap-5 flex-1 min-h-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <SegmentedControl options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} />
                {activeTab === 'tasks'
                    ? <TabActionsTask onCreateClick={() => setIsCreateModalOpen(true)} />
                    : <TabActionsHabit onCreateClick={() => openModal(true)} />
                }
            </div>

            <div className="flex-1 min-h-0">
                {activeTab === 'tasks' ? <TasksBoardContent /> : <HabitsBoardContent />}
            </div>

            <ModalCreateTask show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <ModalCreateTask show={!!editingTask} onClose={closeEditModal} task={editingTask} />
        </section>
    );
};

export const TaskHabitBoard: React.FC = () => (
    <TaskBoardProvider>
        <HabitBoardProvider>
            <TaskHabitBoardInner />
        </HabitBoardProvider>
    </TaskBoardProvider>
);
