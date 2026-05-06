import { supabase } from "../../../../config/Database";
import type { ErrorMessage } from "../../../shared/Error";
import type { Category } from "../../models/Category";
import type { CategoryRequest } from "../../../features/category/resources/CategoryRequest";
import { GroupService } from "../groups/GroupService";

export const CategoryService = {

    getAllCategories: async (): Promise<{ categories: Category[] | null, error: ErrorMessage | null }> => {
        
        if(sessionStorage.getItem('categories')) {
            return { categories: JSON.parse(sessionStorage.getItem('categories')!), error: null };
        } else {
            const { data, error } = await supabase.from('categories').select('*, groups(name, color)');

            if (error) {
                return { categories: null, error: { message: "No se ha recuperado la lista de categorías." } };
            }

            const categories: Category[] = data.map((category: any) => ({
                id: category.id,
                name: category.name,
                description: category.description,
                icon: category.icon,
                group_id: category.group_id,
                group: category.groups ?? undefined,
                created_at: category.created_at
            }));

            sessionStorage.setItem('categories', JSON.stringify(categories));
            
            return { categories, error: null };
        }
        
    },

    updateCategory: async (id: string, request: CategoryRequest): Promise<{ error: ErrorMessage | null }> => {
        const { error } = await supabase.from('categories').update({
            name: request.name,
            description: request.description,
            icon: request.icon,
            group_id: request.group_id || null
        }).eq('id', id);

        if (error) return { error: { message: "No se pudo actualizar la categoría." } };

        const cached = sessionStorage.getItem('categories');
        if (cached) {
            const { groups } = await GroupService.getAllGroups();
            const group = groups?.find(g => g.id === request.group_id);
            const items: Category[] = JSON.parse(cached);
            const updated = items.map(c =>
                c.id === id
                    ? { ...c, name: request.name, description: request.description, icon: request.icon, group_id: request.group_id || null, group: group ? { name: group.name, color: group.color } : undefined }
                    : c
            );
            sessionStorage.setItem('categories', JSON.stringify(updated));
        }

        return { error: null };
    },

    deleteCategory: async (id: string): Promise<{ error: ErrorMessage | null }> => {
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) return { error: { message: "No se pudo eliminar la categoría." } };

        CategoryService.clearCache();
        GroupService.clearCache();
        return { error: null };
    },

    createCategory: async (request: CategoryRequest): Promise<{ error: ErrorMessage | null }> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: "Usuario no autenticado." } };

        const { error } = await supabase.from('categories').insert({
            name: request.name,
            description: request.description,
            icon: request.icon,
            group_id: request.group_id || null
        });

        if (error) return { error: { message: "No se pudo crear la categoría." } };

        CategoryService.clearCache();
        GroupService.clearCache();
        return { error: null };
    },

    clearCache: () => {
        sessionStorage.removeItem('categories');
    },

    getFirstCategory: async (): Promise<{ category: Category | null, error: any }> => {
        const categoriesJson = JSON.parse(sessionStorage.getItem('categories') || 'null');
        if (categoriesJson && categoriesJson.length > 0) {
            return { category: categoriesJson[0], error: null };
        }
        return { category: null, error: null };
    }

    

}