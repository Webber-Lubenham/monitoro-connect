
import { useState } from 'react';
import { GuardianForm as GuardianFormType } from '@/types/database.types';
import { GuardianForm } from './GuardianForm';
import { FormErrors } from '@/hooks/guardians/types'; // Fixed import path

interface GuardianFormContainerProps {
  onSubmit: (guardian: GuardianFormType) => Promise<boolean>;
  errors: FormErrors;
  onClose: () => void;
}

export const GuardianFormContainer = ({ onSubmit, errors, onClose }: GuardianFormContainerProps) => {
  const [newGuardian, setNewGuardian] = useState<GuardianFormType>({ 
    nome: '', 
    telefone: '', 
    email: '', 
    is_primary: false,
    cpf: '',
    student_id: '' // This is required according to the type
  });

  const handleSubmit = async () => {
    const success = await onSubmit(newGuardian);
    if (success) {
      setNewGuardian({ nome: '', telefone: '', email: '', is_primary: false, cpf: '', student_id: '' });
      onClose();
    }
    return success;
  };

  return (
    <GuardianForm
      newGuardian={newGuardian}
      errors={errors}
      onClose={onClose}
      onSubmit={handleSubmit}
      onChange={setNewGuardian}
    />
  );
};
