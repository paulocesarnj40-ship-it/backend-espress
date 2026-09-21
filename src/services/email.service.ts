// @ts-expect-error The project does not include nodemailer's type declarations.
import nodemailer, { Transporter } from 'nodemailer';
import {
  getForgotPasswordEmailTemplate,
  getWelcomeEmailTemplate,
} from '../templates/email.templates.js';

interface SendVerificationEmailParams {
  to: string;
  userName: string;
  token: string;
}

interface SendPasswordResetEmailParams {
  to: string;
  userName: string;
  token: string;
}
// Configuração do cliente SMTP
const transport: Transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.MAIL_PORT) || 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Serviço responsável por preparar e disparar o e-mail de verificação.
 */
export async function sendVerificationEmail({
  to,
  userName,
  token,
}: SendVerificationEmailParams): Promise<void> {
  const appUrl: string = process.env.APP_URL || 'http://localhost:3000';
  const verificationLink: string = `${appUrl}/api/user/confirmar-email?token=${token}`;

  // Gera o código HTML chamando a camada de template
  const htmlContent: string = getWelcomeEmailTemplate({
    userName,
    verificationLink,
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from:
      process.env.MAIL_FROM ||
      '"Minha Aplicação" <no-reply@minhaaplicacao.com>',
    to,
    subject: 'Confirme seu e-mail para ativar sua conta',
    html: htmlContent,
  };

  await transport.sendMail(mailOptions);
}

export async function sendPasswordResetEmail({
  to,
  userName,
  token,
}: SendPasswordResetEmailParams): Promise<void> {
  const appUrl: string = process.env.APP_URL || 'http://localhost:3000';
  const resetLink: string = `${appUrl}/api/user/redefinir-senha?token=${token}`;

  const htmlContent: string = getForgotPasswordEmailTemplate({
    userName,
    resetLink: resetLink,
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from:
      process.env.MAIL_FROM ||
      '"Minha Aplicação" <no-reply@minhaaplicacao.com>',
    to,
    subject: 'Redefinir senha',
    html: htmlContent,
  };

  await transport.sendMail(mailOptions);
}
