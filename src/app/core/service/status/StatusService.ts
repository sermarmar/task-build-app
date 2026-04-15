import { supabase } from "../../../../config/Database";
import type { ErrorMessage } from "../../../shared/Error";
import type { Status } from "../../models/Status";

export const StatusService = {

    getAllStatus: async (): Promise<{ status: Status[] | null, error: ErrorMessage | null }> => {
        
        if(sessionStorage.getItem('status')) {
            return { status: JSON.parse(sessionStorage.getItem('status')!), error: null };
        } else {
            const { data, error } = await supabase.from('statuses').select('*');

            if (error) {
                return { status: null, error: { message: 'No se ha podido obtener los estados' } };
            }

            const statuses: Status[] = data.map((status) => ({
                id: status.id,
                name: status.name,
                description: status.description,
                color: status.color,
                created_at: status.created_at
            }));

            sessionStorage.setItem('status', JSON.stringify(statuses));
            
            return { status: statuses, error: null };
        }
        
    },

    getFirstStatus: async (): Promise<{ status: Status | null, error: ErrorMessage | null }> => {
        const statusJson = JSON.parse(sessionStorage.getItem('status') || 'null');
        if (statusJson && statusJson.length > 0) {
            return { status: statusJson[0], error: null };
        }
        return { status: null, error: { message: 'No status found in session storage' } };
    }

}