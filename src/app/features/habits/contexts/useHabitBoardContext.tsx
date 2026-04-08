import { useContext } from "react";
import { HabitBoardContext, type HabitBoardContextType } from "./HabitBoardContext";

export const useHabitBoardContext = (): HabitBoardContextType => {
    const context = useContext(HabitBoardContext);
    if (!context) {
        throw new Error('useHabitBoard debe usarse dentro de un HabitBoardProvider');
    }
    return context;
};