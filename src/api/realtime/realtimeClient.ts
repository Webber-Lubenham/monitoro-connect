
import { supabase } from '@/lib/supabase';

// Reexportar a instância do cliente Supabase para uso em APIs de tempo real
export const realtimeClient = supabase;
