import 'dotenv/config'; // Carrega as variáveis do arquivo .env
import nodemailer from 'nodemailer';

async function runTest() {
  console.log('🔄 Iniciando teste de conexão SMTP...');

  const mailPort = Number(process.env.MAIL_PORT) || 2525;

  // 1. Instancia o transportador com os dados do .env
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: mailPort,
    secure: mailPort === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // 2. Valida o handshake e credenciais no servidor SMTP
    console.log('📡 Autenticando com o servidor SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso!');

    // 3. Tenta enviar um e-mail de teste
    console.log('✉️ Enviando e-mail de teste...');
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Teste Node" <no-reply@test.com>',
      to: 'paulocesarnj@gmail.com', // Pode ser qualquer e-mail no Mailtrap Sandbox
      subject: '🧪 Teste de Conexão SMTP - Node.js',
      text: 'Se você recebeu este e-mail, a configuração do Mailtrap/SMTP está 100% correta!',
      html: '<h1>🧪 Teste de Conexão SMTP</h1><p>Se você recebeu este e-mail, a configuração do Mailtrap/SMTP está <b>100% correta!</b></p>',
    });

    console.log('🚀 E-mail enviado com sucesso!');
    console.log('ID da Mensagem:', info.messageId);
  } catch (error) {
    console.error('❌ Falha no teste de e-mail:');
    console.error({
      code: error.code,
      command: error.command,
      message: error.message,
    });
  }
}

runTest();
