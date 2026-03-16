import { useEffect, useState } from "react";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import type { Category } from "../../../core/models/Category";
import { Select } from "../../ux/Select";

export const SelectCategory = () => {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        CategoryService.getAllCategories().then((res) => {
            setCategories(res.categories || []);
        });
    }, []);

    return (
        <Select 
            name="category" 
            label="Categoría" 
            list={ categories } 
            onChange={() => {}} 
            className="mb-4"
            getOptionValue={(category: Category) => category.id}
            getOptionLabel={(category: Category) => category.name}
        />
    );
}