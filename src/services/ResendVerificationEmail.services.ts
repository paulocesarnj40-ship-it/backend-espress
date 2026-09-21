import { UsersRepository } from '../modules/users/users.repository.js';
import { generateToken } from '../utils/jwt.utils.js';
import { sendPasswordResetEmail } from './email.service.js';
import { AppError } from '../errors/AppError.js';

export class ResendVerificationEmailService {
  constructor(private usersRepository = new UsersRepository()) {}

  async execute(email: string) {
    // 1. Verificação se o usuário existe
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    // 2. Verificação se o e-mail já foi verificado
    if (user.isVerified) {
      throw new AppError('E-mail já verificado.', 400);
    }

    // 3. Geração do token de verificação
    const verificationToken = generateToken({
      id: user.id,
      email: user.email,
      purpose: 'email_verification',
    });

    // 4. Envio do e-mail de ativação           
    try {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name,
        token: verificationToken,
      });
    } catch (emailError: any) {
      throw new AppError('Não foi possível enviar o e-mail de verificação.', 500);
    }

    return { message: 'E-mail de verificação reenviado com sucesso.' };
  }
}
