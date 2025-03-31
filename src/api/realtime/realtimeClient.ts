
import { supabase } from '@/integrations/supabase/client';

// Reexportar a instância do cliente Supabase para uso em APIs de tempo real
export const realtimeClient = supabase;
