import { supabase } from "../../../../config/Database";
import type { Status } from "../../models/Status";

export const StatusService = {

    getAllStatus: async (): Promise<{ status: Status[] | null, error: any }> => {
        
        if(sessionStorage.getItem('status')) {
            return { status: JSON.parse(sessionStorage.getItem('status')!), error: null };
        } else {
            const { data, error } = await supabase.from('statuses').select('*');

            if (error) {
                return { status: null, error };
            }

            const statuses: Status[] = data.map((status: any) => ({
                id: status.id,
                name: status.name,
                description: status.description,
                color: status.color,
                created_at: status.created_at
            }));

            sessionStorage.setItem('status', JSON.stringify(statuses));
            
            return { status: statuses, error: null };
        }
        
    }

}