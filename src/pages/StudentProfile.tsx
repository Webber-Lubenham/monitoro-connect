import React, { useState, useEffect } from 'react';
import { StudentHeader } from '../components/profile/StudentHeader.tsx';
import { ProfileCard } from '../components/profile/ProfileCard.tsx';
import { useProfile } from '../hooks/useProfile.ts';
import { supabase } from '../integrations/supabase/client.ts';
interface Guardian {
  id: string;
  nome: string;
  email: string;
  student_id: string;
}
import { StudentProfileNotifications } from '../components/profile/StudentProfileNotifications.tsx';
import { Card, CardContent } from '../components/ui/card.tsx';

export function StudentProfile() {
  const { profile, loading } = useProfile();
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoadingGuardians, setIsLoadingGuardians] = useState(true);

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        if (!profile?.id) return;

        setIsLoadingGuardians(true);
        const { data: guardiansData, error: guardiansError } = await supabase
          .from('guardians')
          .select('*')
          .eq('student_id', profile.id);

        if (guardiansError) {
          console.error('Error fetching guardians:', guardiansError);
          return;
        }

        setGuardians(guardiansData || []);
      } catch (err) {
        console.error('Error in fetchGuardians:', err);
      } finally {
        setIsLoadingGuardians(false);
      }
    };

    fetchGuardians();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-1">
          <ProfileCard profile={profile} />
        </div>
        
        <div className="md:col-span-2">
          <StudentProfileNotifications guardians={guardians} />
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Responsáveis</h3>
              {isLoadingGuardians ? (
                <p>Carregando responsáveis...</p>
              ) : guardians.length > 0 ? (
                <ul className="space-y-2">
                  {guardians.map((guardian) => (
                    <li key={guardian.id} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">{guardian.nome}</p>
                      <p className="text-sm text-gray-600">{guardian.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum responsável cadastrado.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
