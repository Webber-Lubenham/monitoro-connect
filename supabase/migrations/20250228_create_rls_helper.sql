-- Create a helper function to apply RLS policies
CREATE OR REPLACE FUNCTION apply_rls_policies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Enable RLS on tables
    ALTER TABLE parent_notification_preferences ENABLE ROW LEVEL SECURITY;
    ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;
    ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
    ALTER TABLE student_locations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE student_notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

    -- Parent Notification Preferences
    DROP POLICY IF EXISTS "Enable read access for guardians" ON parent_notification_preferences;
    CREATE POLICY "Enable read access for guardians"
    ON parent_notification_preferences FOR SELECT
    USING (
        auth.uid() IN (
            SELECT guardian_id FROM guardians 
            WHERE student_id = parent_notification_preferences.student_id
        )
    );

    -- Student Locations
    DROP POLICY IF EXISTS "Enable read for guardians" ON student_locations;
    CREATE POLICY "Enable read for guardians"
    ON student_locations FOR SELECT
    USING (
        auth.uid()::text = student_id::text OR
        EXISTS (
            SELECT 1 FROM guardians 
            WHERE guardian_id = auth.uid() 
            AND student_id = student_locations.student_id
        )
    );

    -- Guardians
    DROP POLICY IF EXISTS "Enable read for related users" ON guardians;
    CREATE POLICY "Enable read for related users"
    ON guardians FOR SELECT
    USING (
        auth.uid() = guardian_id OR
        auth.uid()::text = student_id::text
    );

    -- Notifications
    DROP POLICY IF EXISTS "Enable read for related users" ON student_notifications;
    CREATE POLICY "Enable read for related users"
    ON student_notifications FOR SELECT
    USING (
        auth.uid()::text = student_id::text OR
        EXISTS (
            SELECT 1 FROM guardians 
            WHERE guardian_id = auth.uid() 
            AND student_id = student_notifications.student_id
        )
    );
END;
$$;

-- Create a test function for RLS policies
CREATE OR REPLACE FUNCTION test_rls_policy()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Test if RLS is enabled on critical tables
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'parent_notification_preferences' 
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS not enabled on parent_notification_preferences';
    END IF;

    RETURN true;
END;
$$;
