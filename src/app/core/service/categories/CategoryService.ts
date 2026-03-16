import { supabase } from "../../../../config/Database";
import type { Category } from "../../models/Category";

export const CategoryService = {

    getAllCategories: async (): Promise<{ categories: Category[] | null, error: any }> => {
        
        if(sessionStorage.getItem('categories')) {
            return { categories: JSON.parse(sessionStorage.getItem('categories')!), error: null };
        } else {
            const { data, error } = await supabase.from('categories').select('*');

            if (error) {
                return { categories: null, error };
            }

            const categories: Category[] = data.map((category: any) => ({
                id: category.id,
                name: category.name,
                description: category.description,
                color: category.color,
                created_at: category.created_at
            }));

            sessionStorage.setItem('categories', JSON.stringify(categories));
            
            return { categories, error: null };
        }
        
    }

}