import { supabase } from "../../../../config/Database";
import type { Group } from "../../../features/group/models/Group";

export const GroupService = {

    getAllGroups: async (): Promise<{ groups: Group[] | null; error: { message: string } | null }> => {
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

        return { groups, error: null };
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