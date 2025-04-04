
-- Add user_id column to parent_notification_preferences
ALTER TABLE parent_notification_preferences
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update existing data if needed
-- UPDATE parent_notification_preferences SET user_id = [appropriate_value] WHERE user_id IS NULL;
