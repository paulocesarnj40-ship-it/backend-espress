import nodemailer from "nodemailer";
import { getWelcomeEmailTemplate } from "../templates/email.templates.js";

// Configuração do cliente SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.mailtrap.io",
  port: Number(process.env.MAIL_PORT) || 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Serviço responsável por preparar e disparar o e-mail de verificação.
 * @param {Object} params
 * @param {string} params.to - E-mail do destinatário.
 * @param {string} params.userName - Nome do usuário.
 * @param {string} params.token - Token JWT de confirmação.
 */
export async function sendVerificationEmail({ to, userName, token }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const verificationLink = `${appUrl}/users/confirmar-email?token=${token}`;

  // Gera o código HTML chamando a camada de template
  const htmlContent = getWelcomeEmailTemplate({
    userName,
    verificationLink,
  });

  const mailOptions = {
    from: process.env.MAIL_FROM || '"Minha Aplicação" <no-reply@minhaaplicacao.com>',
    to,
    subject: "Confirme seu e-mail para ativar sua conta",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}