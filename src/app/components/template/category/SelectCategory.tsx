import { useEffect, useState } from "react";
import { CategoryService } from "../../../core/service/categories/CategoryService";
import type { Category } from "../../../core/models/Category";
import { Select } from "../../ux/Select";

interface SelectCategoryProps {
    onChange: (category: Category | null) => void;
    value?: string;
    label?: string;
    showAll?: boolean;
    className?: string;
}

export const SelectCategory = ({ onChange, value, label = "Categoría", showAll = false, className }: SelectCategoryProps) => {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        CategoryService.getAllCategories().then((res) => {
            setCategories(res.categories || []);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!e.target.value) return onChange(null);
        const selected = categories.find(c => c.id === e.target.value);
        if (selected) onChange(selected);
    };

    return (
        <Select
            name="category"
            label={label}
            value={value}
            list={categories}
            onChange={handleChange}
            className={className}
            showAll={showAll}
            getOptionValue={(category: Category) => category.id}
            getOptionLabel={(category: Category) => category.name}
        />
    );
}