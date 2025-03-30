
// Email templates for guardian notifications

import { formatTimestamp } from "./utils.ts";
import { LocationData } from "./types.ts";

/**
 * Generate email content based on notification type
 */
export function generateEmailContent(
  studentName: string,
  guardianName: string,
  locationType: string = 'test',
  locationData?: LocationData
): { subject: string; html: string; text: string } {
  const timestamp = locationData?.timestamp 
    ? formatTimestamp(locationData.timestamp)
    : new Date().toLocaleString("pt-BR");
  
  let subject = '';
  let html = '';
  let text = '';
  
  // Generate email content based on location type
  switch (locationType) {
    case 'arrival':
      subject = `${studentName} chegou à escola`;
      html = getArrivalTemplate(studentName, guardianName, timestamp);
      text = getArrivalPlainText(studentName, guardianName, timestamp);
      break;
      
    case 'departure':
      subject = `${studentName} saiu da escola`;
      html = getDepartureTemplate(studentName, guardianName, timestamp);
      text = getDeparturePlainText(studentName, guardianName, timestamp);
      break;
      
    case 'alert':
      subject = `ALERTA: Localização de ${studentName}`;
      html = getAlertTemplate(studentName, guardianName, timestamp);
      text = getAlertPlainText(studentName, guardianName, timestamp);
      break;
      
    case 'test':
    default:
      subject = `Teste do Sistema Monitore`;
      html = getTestTemplate(studentName, guardianName);
      text = getTestPlainText(studentName, guardianName);
      break;
  }
  
  return { subject, html, text };
}

/**
 * Generate email subject for notifications
 */
export function generateEmailSubject(studentName: string, notificationType: string): string {
  switch (notificationType) {
    case 'arrival':
      return `${studentName} chegou à escola`;
    case 'departure':
      return `${studentName} saiu da escola`;
    case 'alert':
      return `ALERTA: Localização de ${studentName}`;
    case 'test':
    default:
      return `Teste do Sistema Monitore`;
  }
}

// Templates for different notification types
function getArrivalTemplate(studentName: string, guardianName: string, timestamp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Notificação de Chegada</h1>
      <p>Olá, ${guardianName}!</p>
      <p><strong>${studentName}</strong> chegou à escola às <strong>${timestamp}</strong>.</p>
      <p>Tenha um bom dia!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `;
}

function getArrivalPlainText(studentName: string, guardianName: string, timestamp: string): string {
  return `
    Notificação de Chegada
    
    Olá, ${guardianName}!
    
    ${studentName} chegou à escola às ${timestamp}.
    
    Tenha um bom dia!
    
    Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis
  `;
}

function getDepartureTemplate(studentName: string, guardianName: string, timestamp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Notificação de Saída</h1>
      <p>Olá, ${guardianName}!</p>
      <p><strong>${studentName}</strong> saiu da escola às <strong>${timestamp}</strong>.</p>
      <p>Tenha uma boa tarde!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `;
}

function getDeparturePlainText(studentName: string, guardianName: string, timestamp: string): string {
  return `
    Notificação de Saída
    
    Olá, ${guardianName}!
    
    ${studentName} saiu da escola às ${timestamp}.
    
    Tenha uma boa tarde!
    
    Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis
  `;
}

function getAlertTemplate(studentName: string, guardianName: string, timestamp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #FF4136;">ALERTA DE LOCALIZAÇÃO</h1>
      <p>Olá, ${guardianName}!</p>
      <p><strong>${studentName}</strong> está fora da área escolar em <strong>${timestamp}</strong>.</p>
      <p>Verifique a localização no aplicativo Sistema Monitore.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `;
}

function getAlertPlainText(studentName: string, guardianName: string, timestamp: string): string {
  return `
    ALERTA DE LOCALIZAÇÃO
    
    Olá, ${guardianName}!
    
    ${studentName} está fora da área escolar em ${timestamp}.
    
    Verifique a localização no aplicativo Sistema Monitore.
    
    Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis
  `;
}

function getTestTemplate(studentName: string, guardianName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Teste do Sistema Monitore</h1>
      <p>Olá, ${guardianName}!</p>
      <p>Este é um email de teste do Sistema Monitore.</p>
      <p>Se você está recebendo esta mensagem, o sistema de notificações para responsáveis está funcionando corretamente.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `;
}

function getTestPlainText(studentName: string, guardianName: string): string {
  return `
    Teste do Sistema Monitore
    
    Olá, ${guardianName}!
    
    Este é um email de teste do Sistema Monitore.
    
    Se você está recebendo esta mensagem, o sistema de notificações para responsáveis está funcionando corretamente.
    
    Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis
  `;
}
