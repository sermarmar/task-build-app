import { supabase } from "../../../../config/Database";
import type { Group } from "../../../features/group/models/Group";

const CACHE_KEY = 'groups';

export const GroupService = {

    getAllGroups: async (): Promise<{ groups: Group[] | null; error: { message: string } | null }> => {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            return { groups: JSON.parse(cached), error: null };
        }

        const { data, error } = await supabase
            .from('groups')
            .select('*, categories(id, name, icon)')
            .order('name');

        if (error) {
            return { groups: null, error: { message: "No se ha recuperado la lista de grupos." } };
        }

        const groups: Group[] = data.map((g: any) => ({
            id: g.id,
            name: g.name,
            color: g.color,
            created_at: g.created_at,
            categories: g.categories ?? [],
        }));

        sessionStorage.setItem(CACHE_KEY, JSON.stringify(groups));
        return { groups, error: null };
    },

    updateGroupColor: async (id: string, color: string): Promise<{ error: { message: string } | null }> => {
        const { error } = await supabase
            .from('groups')
            .update({ color })
            .eq('id', id);

        if (error) {
            return { error: { message: "No se pudo actualizar el color del grupo." } };
        }

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const groups: Group[] = JSON.parse(cached);
            const updated = groups.map(g => g.id === id ? { ...g, color } : g);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        }

        // Las categorías almacenan el color del grupo embebido — actualizar solo las del grupo modificado
        const categoriesCached = sessionStorage.getItem('categories');
        if (categoriesCached && cached) {
            const groups: Group[] = JSON.parse(cached);
            const group = groups.find(g => g.id === id);
            const groupCategoryIds = new Set(group?.categories?.map(c => c.id) ?? []);

            const categories = JSON.parse(categoriesCached);
            const updatedCategories = categories.map((cat: { id: string; group?: { color: string } }) =>
                groupCategoryIds.has(cat.id) && cat.group
                    ? { ...cat, group: { ...cat.group, color } }
                    : cat
            );
            sessionStorage.setItem('categories', JSON.stringify(updatedCategories));
        }

        return { error: null };
    },

    clearCache: () => {
        sessionStorage.removeItem(CACHE_KEY);
    },

    getGroupsForSelect: async (): Promise<{ groups: Pick<Group, 'id' | 'name' | 'color'>[] | null; error: { message: string } | null }> => {
        const { data, error } = await supabase
            .from('groups')
            .select('id, name, color')
            .order('name');

        if (error) {
            return { groups: null, error: { message: "No se ha recuperado la lista de grupos." } };
        }

        return { groups: data, error: null };
    },

};