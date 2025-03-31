-- Create user profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'guardian', 'institution')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document TEXT,
  email_domain TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id),
  class TEXT,
  enrollment_number TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guardians table
CREATE TABLE IF NOT EXISTS guardians (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT,
  document_number TEXT,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'full' CHECK (access_level IN ('full', 'limited', 'emergency_only')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, guardian_id)
);

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invitation_type TEXT NOT NULL CHECK (invitation_type IN ('student_to_guardian', 'institution_to_student', 'institution_to_staff')),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('student', 'guardian', 'institution')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  location_alerts BOOLEAN DEFAULT TRUE,
  security_alerts BOOLEAN DEFAULT TRUE,
  status_updates BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create privacy settings table
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_location BOOLEAN DEFAULT TRUE,
  location_history_days INTEGER DEFAULT 7,
  share_contact_info BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Guardians can view related students" ON students;
CREATE POLICY "Guardians can view related students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.student_id = students.id
      AND relationships.guardian_id = auth.uid()
      AND relationships.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Students can view their guardians" ON guardians;
CREATE POLICY "Students can view their guardians"
  ON guardians FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.guardian_id = guardians.id
      AND relationships.student_id = auth.uid()
      AND relationships.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users can view their relationships" ON relationships;
CREATE POLICY "Users can view their relationships"
  ON relationships FOR SELECT
  USING (
    auth.uid() = student_id OR auth.uid() = guardian_id
  );

DROP POLICY IF EXISTS "Users can manage their invitations" ON invitations;
CREATE POLICY "Users can manage their invitations"
  ON invitations FOR ALL
  USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can view their notification preferences" ON notification_preferences;
CREATE POLICY "Users can view their notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their notification preferences" ON notification_preferences;
CREATE POLICY "Users can update their notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their privacy settings" ON privacy_settings;
CREATE POLICY "Users can view their privacy settings"
  ON privacy_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their privacy settings" ON privacy_settings;
CREATE POLICY "Users can update their privacy settings"
  ON privacy_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table institutions;
alter publication supabase_realtime add table students;
alter publication supabase_realtime add table guardians;
alter publication supabase_realtime add table relationships;
alter publication supabase_realtime add table invitations;
alter publication supabase_realtime add table notification_preferences;
alter publication supabase_realtime add table privacy_settings;