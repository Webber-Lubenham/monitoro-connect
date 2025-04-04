
import { Guardian, GuardianForm } from '@/types/database.types';

/**
 * Common form validation errors
 */
export interface FormErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  cpf?: string; // Added CPF field error
}

/**
 * Main useGuardians hook interfaces
 */
export interface UseGuardiansState {
  guardians: Guardian[];
  isLoading: boolean;
  errors: FormErrors;
}

export interface UseGuardiansActions {
  loadGuardians: () => Promise<void>;
  addGuardian: (newGuardian: GuardianForm) => Promise<boolean>;
  removeGuardian: (id: string) => Promise<void>;
  setPrimaryGuardian: (id: string) => Promise<void>;
  sendGuardianInvitation: (id: string) => Promise<void>;  // Updated return type to void
}

export interface UseGuardiansReturn extends UseGuardiansState, UseGuardiansActions {}
