import { useEffect, useState } from "react";
import type { Category } from "../../../core/models/Category";
import type { ErrorMessage } from "../../../shared/Error";
import { CategoryService } from "../../../core/service/categories/CategoryService";

export const useCategoryBoard = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<ErrorMessage | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await CategoryService.getAllCategories();
            if (result.error) {
                setError(result.error);
            } else {
                setCategories(result.categories ?? []);
            }
        };

        fetchCategories();
    }, [refreshTrigger]);

    const refreshCategories = () => {
        CategoryService.clearCache();
        setRefreshTrigger(prev => prev + 1);
    };

    return { categories, error, refreshCategories };
};
