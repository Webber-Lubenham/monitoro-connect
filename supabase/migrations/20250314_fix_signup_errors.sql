
-- First, let's ensure we have a proper trigger to create profile records
-- when a new user is registered in auth.users

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles table with required fields
  INSERT INTO public.profiles (
    id, 
    email, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::text,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Check if the trigger exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

-- Make sure the profiles table has proper indices for fast lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
