import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { Category } from "@/app/core/models/Category";
import { Pencil, Trash2 } from "lucide-react";

interface CategoyCardProps {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

export const CategoryCard: React.FC<CategoyCardProps> = ({ category, onEdit, onDelete }) => {
    const color = category.group?.color ?? '#9580b5';

    return (
        <article className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/60 shadow-clay-sm">
            <div className="flex items-center gap-3 min-w-0">
                <span
                    className="size-11 flex items-center justify-center rounded-2xl shrink-0 text-white shadow-clay-pressed"
                    style={{ background: `linear-gradient(160deg, ${color}aa, ${color})` }}
                >
                    <DynamicIcon name={category.icon} />
                </span>
                <div className="min-w-0">
                    <h3 className="font-bold text-primary-950 truncate">{category.name}</h3>
                    <p className="text-sm text-primary-400 truncate">{category.description}</p>
                </div>
            </div>
            <div className="flex gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    aria-label={`Editar ${category.name}`}
                    className="text-primary-400 hover:text-secondary-600 transition-colors cursor-pointer"
                    onClick={() => onEdit(category)}
                >
                    <Pencil size={17} />
                </button>
                <button
                    type="button"
                    aria-label={`Eliminar ${category.name}`}
                    className="text-primary-400 hover:text-accent-blossom-600 transition-colors cursor-pointer"
                    onClick={() => onDelete(category)}
                >
                    <Trash2 size={17} />
                </button>
            </div>
        </article>
    );
}
