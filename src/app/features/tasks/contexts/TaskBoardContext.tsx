import { createContext } from "react";
import type { Task } from "../models/Task";
import type { ErrorMessage } from "../../../shared/Error";

interface TaskBoardContextType {
    tasks: Task[];
    error: ErrorMessage | null;  
    refreshTasks: (cleanStorage?: boolean) => void;
}

export const TaskBoardContext = createContext<TaskBoardContextType | null>(null);