import { supabase } from '../integrations/supabase/client.ts';

const testLogin = async () => {
  const email = 'franklinmarceloferreiradelima@gmail.com';
  const password = '@#$Franklin123';

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('Login successful:', data.user);
  }
};

testLogin();
