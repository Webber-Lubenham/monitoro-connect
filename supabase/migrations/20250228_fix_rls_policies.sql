-- Reset existing RLS policies
ALTER TABLE parent_notification_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE location_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE guardians DISABLE ROW LEVEL SECURITY;
ALTER TABLE logs DISABLE ROW LEVEL SECURITY;

-- Enable RLS on tables
ALTER TABLE parent_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Parent Notification Preferences Policies
CREATE POLICY "Allow guardians to read their notifications"
ON parent_notification_preferences
FOR SELECT
USING (
  auth.uid() IN (
    SELECT guardian_id 
    FROM guardians 
    WHERE student_id = parent_notification_preferences.student_id
  )
);

CREATE POLICY "Allow guardians to update their preferences"
ON parent_notification_preferences
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT guardian_id 
    FROM guardians 
    WHERE student_id = parent_notification_preferences.student_id
  )
);

-- Location Updates Policies
CREATE POLICY "Allow students to insert their location"
ON location_updates
FOR INSERT
WITH CHECK (auth.uid()::text = student_id::text);

CREATE POLICY "Allow guardians to view student locations"
ON location_updates
FOR SELECT
USING (
  auth.uid() IN (
    SELECT guardian_id 
    FROM guardians 
    WHERE student_id = location_updates.student_id
  )
);

-- Guardians Policies
CREATE POLICY "Allow guardians to view their own records"
ON guardians
FOR SELECT
USING (
  auth.uid() = guardian_id OR
  auth.uid()::text = student_id::text
);

CREATE POLICY "Allow guardians to update their own records"
ON guardians
FOR UPDATE
USING (auth.uid() = guardian_id);

-- Logs Policies
CREATE POLICY "Allow users to view their own logs"
ON logs
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow system to insert logs"
ON logs
FOR INSERT
WITH CHECK (true);
