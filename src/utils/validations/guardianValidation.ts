
import type { GuardianForm } from '@/types/database.types';
import type { FormErrors } from '@/hooks/guardians';

// CPF validation helper
const isValidCPF = (cpf: string): boolean => {
  // Se CPF estiver vazio, considerar válido (já que é opcional)
  if (!cpf) return true;
  
  // Remover caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // CPF deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Calcular dígitos verificadores
  let sum = 0;
  let remainder;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

export const validateGuardianForm = (guardian: GuardianForm): FormErrors => {
  const errors: FormErrors = {};
  
  if (!guardian.nome.trim()) {
    errors.nome = 'Nome é obrigatório';
  } else if (guardian.nome.length < 3) {
    errors.nome = 'Nome deve ter pelo menos 3 caracteres';
  }

  if (!guardian.telefone.trim()) {
    errors.telefone = 'Telefone é obrigatório';
  } else {
    // Remover todos os caracteres não numéricos para validação
    const cleanPhone = guardian.telefone.replace(/\D/g, '');
    
    // Formato brasileiro (10-11 dígitos) ou formato UK (10-11 dígitos)
    // BR: (11) 98765-4321 -> 11987654321
    // UK: +44 7700 900123 -> 447700900123
    const isValidBR = /^[1-9]{2}[0-9]{8,9}$/.test(cleanPhone);
    const isValidUK = /^(44)[0-9]{10}$/.test(cleanPhone);
    
    if (!isValidBR && !isValidUK) {
      errors.telefone = 'Formato de telefone inválido. Use +44 para UK ou (XX) para Brasil';
    }
  }

  if (!guardian.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardian.email)) {
    errors.email = 'Email inválido';
  }

  // Validação de CPF (campo opcional)
  if (guardian.cpf && !isValidCPF(guardian.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  return errors;
};
