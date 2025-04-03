
export interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
}

export interface GuardianHookOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseGuardiansReturn {
  guardians: any[];
  isLoading: boolean;
  errors: FormErrors;
  loadGuardians: () => Promise<any>;
  addGuardian: (data: any) => Promise<boolean>;
  removeGuardian: (id: string) => Promise<void>;
  setPrimaryGuardian: (id: string) => Promise<void>;
  sendGuardianInvitation: (id: string) => Promise<void>;
}
