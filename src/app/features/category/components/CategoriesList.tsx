import { CategoryCard } from "./CategoryCard";
import type { Category } from "@/app/core/models/Category";
import { useCategoryBoardContext } from "../contexts/useCategoryBoardContext";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";

interface CategoriesListProps {
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

const CategoryCardSkeleton: React.FC = () => (
    <div className="rounded-2xl bg-white/50 p-3 flex items-center gap-3">
        <Skeleton className="size-11 rounded-xl shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <SkeletonLine className="w-1/2" />
            <SkeletonLine className="w-3/4 h-3" />
        </div>
    </div>
);

export const CategoriesList: React.FC<CategoriesListProps> = ({ onEdit, onDelete }) => {
    const { categories, isLoading } = useCategoryBoardContext();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
            </div>
        );
    }

    return categories.length === 0 ? (
        <p className="text-primary-400 font-bold">No hay categorías disponibles.</p>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((category: Category) => (
                <CategoryCard key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
};
