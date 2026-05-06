import { useContext } from "react";
import { CategoryBoardContext } from "./CategoryBoardContext";

export const useCategoryBoardContext = () => {
    const ctx = useContext(CategoryBoardContext);
    if (!ctx) throw new Error("useCategoryBoardContext must be used within CategoryBoardProvider");
    return ctx;
};
