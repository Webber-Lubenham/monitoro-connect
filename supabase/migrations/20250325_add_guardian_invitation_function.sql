
-- Create a function to update guardian invitation timestamp
CREATE OR REPLACE FUNCTION public.update_guardian_invitation_timestamp(guardian_id UUID, sent_at TIMESTAMP WITH TIME ZONE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE guardians
  SET invitation_sent_at = sent_at
  WHERE id = guardian_id;
END;
$$;

-- Grant execution permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.update_guardian_invitation_timestamp TO anon, authenticated;
