import { CategoryBoardContext } from "./CategoryBoardContext";
import { useCategoryBoard } from "./useCategoryBoard";

export const CategoryBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useCategoryBoard();
    return <CategoryBoardContext.Provider value={value}>{children}</CategoryBoardContext.Provider>;
};
