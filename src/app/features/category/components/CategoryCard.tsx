import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { Category } from "@/app/core/models/Category";
import { useColorAlpha } from "@/app/hooks/useColorAlpha";
import { Pencil, Trash2 } from "lucide-react";

interface CategoyCardProps {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

export const CategoryCard: React.FC<CategoyCardProps> = ({ category, onEdit, onDelete }) => {
    const color = category.group?.color ?? '#6b7280';

    return (
    <div key={category.id} className="flex items-center justify-between p-4 rounded-md border-l-5 border-tertiary-200 w-full"
        style={{
            backgroundColor: useColorAlpha(color, 0.2),
            borderColor: color,
        }}>
        <div className="flex items-center gap-4">
            <span className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                style={{ backgroundColor: color }}>
                <DynamicIcon name={category.icon} />
            </span>
            <div className="flex flex-col gap-2">
                <h3 className="text-md font-bold">{category.name}</h3>
                <h5 className="text-sm text-secondary-800">{category.description}</h5>
            </div>
        </div>
        <div className="flex gap-2">
            <span className="text-secondary-800/70 cursor-pointer" onClick={() => onEdit(category)}>
                <Pencil />
            </span>
            <span className="text-secondary-800/70 cursor-pointer" onClick={() => onDelete(category)}>
                <Trash2 />
            </span>
        </div>
        

    </div>
    );
}