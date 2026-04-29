import { supabase } from "../../../../config/Database";
import type { ErrorMessage } from "../../../shared/Error";
import type { Category } from "../../models/Category";

export const CategoryService = {

    getAllCategories: async (): Promise<{ categories: Category[] | null, error: ErrorMessage | null }> => {
        
        if(sessionStorage.getItem('categories')) {
            return { categories: JSON.parse(sessionStorage.getItem('categories')!), error: null };
        } else {
            const { data, error } = await supabase.from('categories').select('*');

            if (error) {
                return { categories: null, error: { message: "No se ha recuperado la lista de categorías." } };
            }

            const categories: Category[] = data.map((category: any) => ({
                id: category.id,
                name: category.name,
                description: category.description,
                color: category.color,
                icon: category.icon, // Aquí deberías convertir el valor de icon a un ReactNode si es necesario
                created_at: category.created_at
            }));

            sessionStorage.setItem('categories', JSON.stringify(categories));
            
            return { categories, error: null };
        }
        
    },

    getFirstCategory: async (): Promise<{ category: Category | null, error: any }> => {
        const categoriesJson = JSON.parse(sessionStorage.getItem('categories') || 'null');
        if (categoriesJson && categoriesJson.length > 0) {
            return { category: categoriesJson[0], error: null };
        }
        return { category: null, error: null };
    }

}