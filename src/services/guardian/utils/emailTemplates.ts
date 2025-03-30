
/**
 * Templates de email para comunicação com responsáveis
 */
export const guardianEmailTemplates = {
  /**
   * Email de boas-vindas para responsáveis recém-adicionados
   */
  welcome: (guardianName: string, studentName?: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
      <p>Olá ${guardianName},</p>
      <p>Você foi adicionado(a) como responsável ${studentName ? `de <strong>${studentName}</strong>` : ''} no Sistema Monitore.</p>
      <p>Com o Sistema Monitore, você poderá:</p>
      <ul>
        <li>Acompanhar a localização do aluno em tempo real</li>
        <li>Receber notificações de segurança</li>
        <li>Configurar áreas seguras e receber alertas</li>
      </ul>
      <p>Para criar sua conta e começar a usar o sistema, clique no botão abaixo:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="#GUARDIAN_SIGNUP_LINK#" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Criar minha conta
        </a>
      </div>
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
        #GUARDIAN_SIGNUP_LINK#
      </p>
      <p>Este link é válido por 7 dias. Se você não reconhece este aluno ou acredita que recebeu este email por engano, por favor, ignore-o.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `,
  
  /**
   * Email informando que a conta foi criada com sucesso
   */
  accountCreated: (guardianName: string, loginUrl: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
      <p>Olá ${guardianName},</p>
      <p>Sua conta de responsável no Sistema Monitore foi criada com sucesso!</p>
      <p>Agora você pode acessar o sistema e começar a monitorar a localização do aluno.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Acessar o sistema
        </a>
      </div>
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
        ${loginUrl}
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `,
  
  /**
   * Email com atualização de localização do aluno
   */
  locationSharing: (guardianName: string, studentName: string, mapUrl: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Atualização de Localização</h1>
      <p>Olá ${guardianName},</p>
      <p>O Sistema Monitore está enviando uma atualização sobre a localização de ${studentName}.</p>
      <p>Você pode visualizar a localização atual clicando no botão abaixo:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${mapUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Ver localização
        </a>
      </div>
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
        ${mapUrl}
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `,

  /**
   * Email notificando remoção de responsável
   */
  removal: (guardianName: string, studentName: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
      <p>Olá ${guardianName},</p>
      <p>Este email é para informar que você não é mais um responsável cadastrado para ${studentName} no Sistema Monitore.</p>
      <p>Se você acredita que isso foi um erro, entre em contato com o aluno ou com outro responsável cadastrado.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `,

  /**
   * Email notificando atualização de informações
   */
  emailUpdate: (guardianName: string, studentName: string, newEmail: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
      <p>Olá ${guardianName},</p>
      <p>Este email é para confirmar que suas informações de contato como responsável de ${studentName} no Sistema Monitore foram atualizadas.</p>
      <p>Seu novo email para contato é: <strong>${newEmail}</strong></p>
      <p>Se você não solicitou esta alteração, entre em contato imediatamente com o aluno ou com a escola.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `,

  /**
   * Email confirmando atualização no novo endereço
   */
  emailUpdateConfirmation: (guardianName: string, studentName: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
      <p>Olá ${guardianName},</p>
      <p>Este email confirma que seu endereço de email foi atualizado como responsável de ${studentName} no Sistema Monitore.</p>
      <p>A partir de agora, você receberá todas as notificações neste novo endereço de email.</p>
      <p>Se você não solicitou esta alteração, entre em contato imediatamente com o aluno ou com a escola.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `
};
