import { CategoryCard } from "./CategoryCard";
import type { Category } from "@/app/core/models/Category";
import { useCategoryBoardContext } from "../contexts/useCategoryBoardContext";

interface CategoriesListProps {
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ onEdit, onDelete }) => {
    const { categories } = useCategoryBoardContext();

    return (
        <>
            {categories.length === 0 ? (
                <p>No hay categorías disponibles.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4 w-full">
                    {categories.map((category: Category) => (
                        <CategoryCard key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </>
    );
};