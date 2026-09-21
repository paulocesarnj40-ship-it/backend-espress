interface WelcomeEmailTemplateParams {
  userName: string;
  verificationLink: string;
}

interface ForgotPasswordEmailTemplateParams {
  userName: string;
  resetLink: string;
}
/**
 * Retorna o HTML do e-mail de verificação de cadastro.
 */
export function getWelcomeEmailTemplate({
  userName,
  verificationLink,
}: WelcomeEmailTemplateParams): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Cadastro</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, sans-serif; color: #333333;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              
              <!-- Cabeçalho -->
              <tr>
                <td align="center" style="background-color: #2563eb; padding: 30px 20px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                    Bem-vindo(a) à nossa plataforma!
                  </h1>
                </td>
              </tr>

              <!-- Conteúdo Principal -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <p style="font-size: 16px; line-height: 1.5; color: #333333; margin-top: 0;">
                    Olá, <strong>${userName}</strong>!
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #555555;">
                    Seu cadastro foi realizado com sucesso. Para começar a usar sua conta com segurança, clique no botão abaixo para confirmar seu e-mail:
                  </p>
                  
                  <!-- Botão de Ação -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationLink}" 
                           target="_blank" 
                           style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                           Confirmar meu E-mail
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 13px; line-height: 1.5; color: #777777;">
                    Se o botão acima não funcionar, copie e cole o link a seguir no seu navegador:
                  </p>
                  <p style="font-size: 12px; color: #2563eb; word-break: break-all;">
                    <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
                  </p>
                </td>
              </tr>

              <!-- Rodapé -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                    Se você não solicitou este cadastro, por favor desconsidere este e-mail.
                  </p>
                  <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">
                    &copy; ${new Date().getFullYear()} Minha Aplicação. Todos os direitos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getForgotPasswordEmailTemplate({
  userName,
  resetLink,
}: ForgotPasswordEmailTemplateParams): string {
  return `
<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperação de Senha</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, sans-serif; color: #333333;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              
              <!-- Cabeçalho -->
              <tr>
                <td align="center" style="background-color: #2563eb; padding: 30px 20px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                    Recuperação de Senha
                  </h1>
                </td>
              </tr>

              <!-- Conteúdo Principal -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <p style="font-size: 16px; line-height: 1.5; color: #333333; margin-top: 0;">
                    Olá, <strong>${userName}</strong>!
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #555555;">
                    Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
                  </p>
                  
                  <!-- Botão de Ação -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" 
                           target="_blank" 
                           style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                           Redefinir Minha Senha
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 13px; line-height: 1.5; color: #777777;">
                    Se o botão acima não funcionar, copie e cole o link a seguir no seu navegador:
                  </p>
                  <p style="font-size: 12px; color: #2563eb; word-break: break-all;">
                    <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
                  </p>
                </td>
              </tr>

              <!-- Rodapé -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                    Se você não solicitou a redefinição de senha, nenhuma ação é necessária. Sua senha permanecerá a mesma.
                  </p>
                  <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">
                    &copy; ${new Date().getFullYear()} Minha Aplicação. Todos os direitos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
