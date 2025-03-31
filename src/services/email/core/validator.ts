
import { EmailParams } from './types';

/**
 * Validates email parameters
 */
export const validateEmailParams = (params: EmailParams): { isValid: boolean; errorMessage?: string } => {
  const { to, subject, html } = params;
  
  if (!to) {
    return { 
      isValid: false, 
      errorMessage: 'Destinatário do email não fornecido' 
    };
  }
  
  if (!subject) {
    return { 
      isValid: false, 
      errorMessage: 'Assunto do email não fornecido' 
    };
  }
  
  if (!html) {
    return { 
      isValid: false, 
      errorMessage: 'Conteúdo HTML do email não fornecido' 
    };
  }
  
  // Verificar formato básico de email
  if (!to.includes('@')) {
    return { 
      isValid: false, 
      errorMessage: 'Formato de email inválido' 
    };
  }
  
  return { isValid: true };
};
