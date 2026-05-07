import { useEffect, useState } from "react";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import type { Category } from "../../../core/models/Category";
import { Select } from "../../ux/Select";

export const SelectCategory = ({ onChange, value }: { onChange: (category: Category) => void; value?: string }) => {

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
            value={ value }
            list={ categories }
            onChange={(e) => {
                const selected = categories.find(c => c.id === e.target.value);
                if (selected) onChange(selected);
            }}
            className="mb-4"
            getOptionValue={(category: Category) => category.id}
            getOptionLabel={(category: Category) => category.name}
        />
    );
}