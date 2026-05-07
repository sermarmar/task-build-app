import { createContext } from "react";
import type { Task } from "../models/Task";
import type { ErrorMessage } from "../../../shared/Error";

interface TaskBoardContextType {
    tasks: Task[];
    error: ErrorMessage | null;
    refreshTasks: (cleanStorage?: boolean) => void;
    openEditModal: (task: Task) => void;
    closeEditModal: () => void;
    editingTask: Task | null;
}

export const TaskBoardContext = createContext<TaskBoardContextType | null>(null);