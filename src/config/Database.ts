import { createClient } from '@supabase/supabase-js';
import { USE_MOCKS } from '@/config/env';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!USE_MOCKS && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error(
        'Missing Supabase environment variables. ' +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
}

// En modo mock ningún repositorio usa el cliente: si algo lo usa por error, que falle en vez de ir a Supabase
export const supabase = USE_MOCKS
    ? (null as unknown as ReturnType<typeof createClient>)
    : createClient(supabaseUrl, supabaseAnonKey);
