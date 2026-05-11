import { CategoryCard } from "./CategoryCard";
import type { Category } from "@/app/core/models/Category";
import { useCategoryBoardContext } from "../contexts/useCategoryBoardContext";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";

interface CategoriesListProps {
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

const CategoryCardSkeleton: React.FC = () => (
    <div className="rounded-xl border border-primary-100 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
            <SkeletonLine className="w-1/2" />
        </div>
        <SkeletonLine className="w-3/4 h-3" />
        <Skeleton className="w-16 h-5 rounded-full" />
    </div>
);

export const CategoriesList: React.FC<CategoriesListProps> = ({ onEdit, onDelete }) => {
    const { categories, isLoading } = useCategoryBoardContext();

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-4 w-full">
                {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
            </div>
        );
    }

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