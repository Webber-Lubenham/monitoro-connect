-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for guardians" ON public.guardians;
DROP POLICY IF EXISTS "Enable read access for responsible_persons" ON public.responsible_persons;
DROP POLICY IF EXISTS "Enable write access for guardians" ON public.guardians;
DROP POLICY IF EXISTS "Enable read access for parent_notification_preferences" ON public.parent_notification_preferences;

-- Drop existing policies
DROP POLICY IF EXISTS "Guardians can view their own data" ON public.guardians;
DROP POLICY IF EXISTS "Guardians can update their own data" ON public.guardians;
DROP POLICY IF EXISTS "Responsible persons can view their guardians" ON public.guardians;
DROP POLICY IF EXISTS "Responsible persons can view their own data" ON public.responsible_persons;
DROP POLICY IF EXISTS "Guardians can view responsible persons" ON public.responsible_persons;

-- Create simplified policies for guardians
CREATE POLICY "Enable all access for authenticated users"
ON public.guardians
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create simplified policy for responsible_persons
CREATE POLICY "Enable all access for authenticated users"
ON public.responsible_persons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create simplified policy for parent_notification_preferences
CREATE POLICY "Enable all access for authenticated users"
ON public.parent_notification_preferences
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable RLS on all tables
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsible_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_notification_preferences ENABLE ROW LEVEL SECURITY;
