
-- Create a function to safely get a profile by email
CREATE OR REPLACE FUNCTION public.get_profile_by_email(email_param TEXT)
RETURNS TABLE(id UUID, email TEXT, role TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.role
  FROM profiles p
  WHERE p.email = email_param;
END;
$$;
