import { supabase } from '../integrations/supabase/client.ts';
const STORAGE_KEY = 'sb-rsvjnndhbyyxktbczlnk-auth-token';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface ProfileUpdates {
  email?: string;
  role?: string;
}

export const initializeAuth = () => {
  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('monitore.user.preferences');
    }
    
    if (event === 'SIGNED_IN' && session?.user?.id) {
      initializeUserPreferences(session.user.id);
      ensureProfileData(session.user.id, session.user.email, session.user.user_metadata?.role);
    }
  });
};

const ensureProfileData = async (userId: string, email?: string, role?: string) => {
  if (!userId) return;
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking profile:', error);
      
      if (error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: userId,
            email: email,
            role: role || 'student'
          });
        
        if (insertError) console.error('Error creating profile:', insertError);
      }
      return;
    }
    
    const updates: ProfileUpdates = {};
    if (profile && email && !profile.email) updates.email = email;
    if (profile && role && !profile.role) updates.role = role;
    
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (updateError) console.error('Error updating profile:', updateError);
    }
  } catch (error) {
    console.error('Error ensuring profile data:', error);
  }
};

const initializeUserPreferences = async (userId: string) => {
  try {
    // First check if table exists
    const { error: tableError } = await supabase
      .from('parent_notification_preferences')
      .select('*')
      .limit(1);

    if (tableError?.code === '42P01') {
      console.log('Notification preferences table does not exist');
      return;
    }

    // Then check if user_id column exists
    const { error: columnError } = await supabase
      .from('parent_notification_preferences')
      .select('user_id')
      .limit(1);

    if (columnError?.code === '42703') {
      console.log('user_id column missing from notification preferences table');
      return;
    }

    // Finally get user preferences
    const { data: preferences, error } = await supabase
      .from('parent_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user preferences:', error);
      return;
    }

    if (preferences) {
      localStorage.setItem('monitore.user.preferences', JSON.stringify(preferences));
    }
  } catch (error) {
    console.error('Error initializing user preferences:', error);
  }
};
