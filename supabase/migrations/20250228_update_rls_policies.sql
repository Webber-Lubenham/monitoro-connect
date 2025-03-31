-- Reset and enable RLS on critical tables
ALTER TABLE parent_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Parent Notification Preferences Policies
DROP POLICY IF EXISTS "Enable read access for guardians" ON parent_notification_preferences;
CREATE POLICY "Enable read access for guardians"
ON parent_notification_preferences FOR SELECT
USING (
  auth.uid() IN (
    SELECT guardian_id FROM guardians 
    WHERE student_id = parent_notification_preferences.student_id
  )
);

DROP POLICY IF EXISTS "Enable update for guardians" ON parent_notification_preferences;
CREATE POLICY "Enable update for guardians"
ON parent_notification_preferences FOR UPDATE
USING (
  auth.uid() IN (
    SELECT guardian_id FROM guardians 
    WHERE student_id = parent_notification_preferences.student_id
  )
);

-- Student Locations Policies
DROP POLICY IF EXISTS "Enable insert for students" ON student_locations;
CREATE POLICY "Enable insert for students"
ON student_locations FOR INSERT
WITH CHECK (
  auth.uid()::text = student_id::text OR
  EXISTS (
    SELECT 1 FROM guardians 
    WHERE guardian_id = auth.uid() 
    AND student_id = student_locations.student_id
  )
);

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

-- Guardians Policies
DROP POLICY IF EXISTS "Enable read for related users" ON guardians;
CREATE POLICY "Enable read for related users"
ON guardians FOR SELECT
USING (
  auth.uid() = guardian_id OR
  auth.uid()::text = student_id::text
);

DROP POLICY IF EXISTS "Enable update for guardians" ON guardians;
CREATE POLICY "Enable update for guardians"
ON guardians FOR UPDATE
USING (
  auth.uid() = guardian_id
);

-- Student Notifications Policies
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

DROP POLICY IF EXISTS "Enable insert for system" ON student_notifications;
CREATE POLICY "Enable insert for system"
ON student_notifications FOR INSERT
WITH CHECK (true);

-- Logs Policies
DROP POLICY IF EXISTS "Enable insert for system" ON logs;
CREATE POLICY "Enable insert for system"
ON logs FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read for own logs" ON logs;
CREATE POLICY "Enable read for own logs"
ON logs FOR SELECT
USING (
  auth.uid()::text = (logs.data->>'user_id')::text OR
  EXISTS (
    SELECT 1 FROM guardians 
    WHERE guardian_id = auth.uid() 
    AND student_id = (logs.data->>'student_id')::text
  )
);
