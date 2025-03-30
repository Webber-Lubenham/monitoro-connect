
import { useState } from 'react';
import { GuardianForm as GuardianFormType } from '@/types/database.types';
import { GuardianForm } from './GuardianForm';
import { FormErrors } from '@/hooks/useGuardians';

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
    isPrimary: false,
    cpf: '' // Initialize CPF field
  });

  const handleSubmit = async () => {
    const success = await onSubmit(newGuardian);
    if (success) {
      setNewGuardian({ nome: '', telefone: '', email: '', isPrimary: false, cpf: '' });
      onClose();
    }
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
