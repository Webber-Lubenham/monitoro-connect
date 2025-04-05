
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GuardianSignupFormProps {
  token: string;
  email: string;
  onSuccess: () => void;
}

interface InvitationDetails {
  student_id: string;
  parent_id?: string;
  email: string;
  used: boolean;
  token: string;
  created_at: string;
  studentName?: string;
  studentEmail?: string;
}

export const GuardianSignupForm = ({ token, email, onSuccess }: GuardianSignupFormProps) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationDetails, setInvitationDetails] = useState<InvitationDetails | null>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(true);

  // Fetch invitation details on mount
  useEffect(() => {
    const fetchInvitationDetails = async () => {
      try {
        setIsLoadingInvitation(true);
        console.log(`Fetching invitation details for: ${email}, token: ${token}`);
        
        // Get invitation details by token
        const { data, error } = await supabase
          .from('student_invitations')
          .select('student_id, parent_id, email, used, token, created_at')
          .eq('token', token)
          .eq('email', email.toLowerCase().trim())
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching invitation:', error);
          throw error;
        }
        
        console.log('Invitation data:', data);
        
        if (!data) {
          setError('Invitation not found or expired.');
          setInvitationDetails(null);
        } else if (data.used) {
          setError('This invitation has already been used. Please log in normally.');
          setInvitationDetails(null);
        } else {
          // Fetch student details
          const { data: studentData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', data.student_id)
            .maybeSingle();
          
          console.log('Student data:', studentData);
          
          setInvitationDetails({
            ...data,
            studentName: studentData?.name || 'student',
            studentEmail: studentData?.email
          });
        }
      } catch (error: any) {
        console.error('Error verifying invitation:', error);
        setError('Error verifying invitation: ' + error.message);
        setInvitationDetails(null);
      } finally {
        setIsLoadingInvitation(false);
      }
    };
    
    fetchInvitationDetails();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!invitationDetails) {
      setError('Invalid invitation details');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting guardian registration');
      let userId;
      
      // Check if parent_id exists in the invitation
      if (invitationDetails.parent_id) {
        console.log('User already exists, updating password');
        // User already exists, update password and role
        
        // This endpoint requires admin privileges, handled server-side
        // Need to call a secure function instead
        const { data, error } = await supabase.functions.invoke('update-user-password', {
          body: { 
            user_id: invitationDetails.parent_id, 
            password, 
            role: 'guardian' 
          }
        });
        
        if (error) {
          console.error('Error updating user:', error);
          throw error;
        }
        
        userId = invitationDetails.parent_id;
      } else {
        console.log('Creating new user');
        // New user, create account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'guardian'
            }
          }
        });
        
        if (signUpError) {
          console.error('Error in signup:', signUpError);
          throw signUpError;
        }
        
        if (!signUpData.user) {
          throw new Error('Failed to create account');
        }
        
        console.log('Account created:', signUpData.user);
        userId = signUpData.user.id;
      }
      
      // Mark the invitation as used and update parent_id
      console.log('Updating invitation as used');
      const { error: inviteError } = await supabase
        .from('student_invitations')
        .update({
          used: true,
          parent_id: userId
        })
        .eq('token', token)
        .eq('email', email.toLowerCase().trim());
      
      if (inviteError) {
        console.error('Error updating invitation:', inviteError);
        // Continue anyway
      }
      
      // Add entry to the profiles table if it doesn't exist
      console.log('Creating/updating profile');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: email.split('@')[0],
          last_name: '',
          role: 'guardian',
          email: email.toLowerCase().trim()
        });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Continue anyway
      }
      
      // Show success and redirect
      toast({
        title: "Account created successfully!",
        description: "Your guardian account has been created. Log in to access the system.",
      });
      
      console.log('Registration process completed successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error in guardian registration:', error);
      
      if (error.message?.includes('User already registered')) {
        setError('This email is already registered. Please log in.');
      } else {
        setError(error.message || 'An error occurred while creating your account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingInvitation) {
    return (
      <Card className="p-6 shadow-lg max-w-md w-full mx-auto text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Verifying invitation...</p>
      </Card>
    );
  }

  if (!invitationDetails) {
    return (
      <Card className="p-6 shadow-lg max-w-md w-full mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Invitation</AlertTitle>
          <AlertDescription>
            {error || 'This invitation is not valid or has already been used. Please ask the student to send a new invitation.'}
          </AlertDescription>
        </Alert>
        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Return to home page
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Guardian Account</h2>
      
      <Alert className="mb-6">
        <AlertTitle>Invitation from {invitationDetails.studentName}</AlertTitle>
        <AlertDescription>
          You have been invited to be a guardian of {invitationDetails.studentName}.
          {invitationDetails.studentEmail && (
            <span> Student's email: {invitationDetails.studentEmail}</span>
          )}
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email:</label>
          <Input
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">This is the email that received the invitation.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            required
            minLength={6}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm password:</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter password again"
            required
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Card>
  );
};
