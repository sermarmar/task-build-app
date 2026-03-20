import { useTaskBoard } from "../hook/useTaskBoard";
import { TaskBoardContext } from "./TaskBoardContext";

export const TaskBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useTaskBoard();
    return <TaskBoardContext.Provider value={value}>{children}</TaskBoardContext.Provider>;
};