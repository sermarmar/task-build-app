import { useEffect, useState } from "react";
import type { Category } from "../../../core/models/Category";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import { DynamicIcon } from "../../../components/ux/DynamicIcon";

export const CategoriesList: React.FC = () => {
    
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        CategoryService.getAllCategories().then((res) => {
            if (res.error) {
                console.error("Error fetching categories", res.error.message);
                return;
            }
            setCategories(res.categories || []);
        }).catch(err => {
            console.error("Error fetching categories", err);
        });
    }, []);

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    return (
        <>
            {categories.length === 0 ? (
                <p>No hay categorías disponibles.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4 w-full">
                    {
                        categories.map((category: Category) => 
                            <div key={category.id} className="flex gap-4 items-center p-4 rounded-md border-l-5 border-tertiary-200 w-full"
                                style={{
                                    backgroundColor: hexToRgba(category.color, 0.2),
                                    borderColor: category.color,
                                }}>
                                <span className="text-tertiary-50 w-10 h-10 flex items-center justify-center rounded-full"
                                    style={{ backgroundColor: category.color }}>
                                    <DynamicIcon name={category.icon} />
                                </span>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-md font-bold">{category.name}</h3>
                                    <h5 className="text-sm text-secondary-800">{category.description}</h5>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </>
        
    );
};