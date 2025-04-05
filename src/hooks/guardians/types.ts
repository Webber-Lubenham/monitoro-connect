
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
