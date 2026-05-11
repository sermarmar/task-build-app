import { createContext } from "react";
import type { Task, TaskFilters } from "../models/Task";
import type { ErrorMessage } from "../../../shared/Error";

interface TaskBoardContextType {
    tasks: Task[];
    error: ErrorMessage | null;
    isLoading: boolean;
    refreshTasks: (cleanStorage?: boolean) => void;
    openEditModal: (task: Task) => void;
    closeEditModal: () => void;
    editingTask: Task | null;
    filters: TaskFilters;
    setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
}

export const TaskBoardContext = createContext<TaskBoardContextType | null>(null);