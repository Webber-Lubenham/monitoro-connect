
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentHeader } from '@/components/profile/StudentHeader';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ActionButtons } from '@/components/profile/ActionButtons';
import { GuardiansList } from '@/components/profile/GuardiansList';
import { GuardianFormContainer } from '@/components/profile/GuardianFormContainer';
import { useGuardians } from '@/hooks/guardians';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GuardianForm } from '@/types/database.types';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const {
    guardians,
    isLoading,
    errors,
    loadGuardians,
    addGuardian,
    removeGuardian,
    setPrimaryGuardian,
    sendGuardianInvitation
  } = useGuardians();

  // Only fetch guardians once on initial mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchGuardians = async () => {
      try {
        await loadGuardians();
        if (isMounted) {
          setLoadingInitial(false);
        }
      } catch (error) {
        console.error("Error loading guardians:", error);
        if (isMounted) {
          toast({
            title: "Erro ao carregar responsáveis",
            description: "Ocorreu um erro ao carregar a lista de responsáveis. Tente novamente.",
            variant: "destructive",
          });
          setLoadingInitial(false);
        }
      }
    };

    fetchGuardians();
    
    return () => {
      isMounted = false;
    };
  }, []);  // Empty dependency array to only run once

  const handleAddGuardian = async (data: GuardianForm) => {
    const success = await addGuardian(data);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  // Handle send invitation button click - wraps the original function to match expected type
  const handleSendInvitation = async (id: string) => {
    await sendGuardianInvitation(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF] p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <StudentHeader />
        
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-white/50 flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        <ProfileCard />
        <ActionButtons onShowForm={() => setShowForm(true)} />
        
        {showForm && (
          <GuardianFormContainer
            errors={errors}
            onClose={() => setShowForm(false)}
            onSubmit={handleAddGuardian}
          />
        )}

        <GuardiansList
          guardians={guardians}
          isLoading={isLoading || loadingInitial}
          onSetPrimary={setPrimaryGuardian}
          onRemove={removeGuardian}
          onSendInvitation={handleSendInvitation}
        />
      </div>
    </div>
  );
};

export default StudentProfile;
