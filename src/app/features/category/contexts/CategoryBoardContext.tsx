import { createContext } from "react";
import type { Category } from "../../../core/models/Category";
import type { ErrorMessage } from "../../../shared/Error";

interface CategoryBoardContextType {
    categories: Category[];
    error: ErrorMessage | null;
    refreshCategories: () => void;
}

export const CategoryBoardContext = createContext<CategoryBoardContextType | null>(null);
