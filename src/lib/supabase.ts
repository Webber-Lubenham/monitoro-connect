
import { supabase } from '../integrations/supabase/client.ts';
import type { Database } from '../integrations/supabase/database.types.ts';

// Re-export to maintain backward compatibility
export { supabase };
export type { Database };
