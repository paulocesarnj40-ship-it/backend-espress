// modules/users/forgot-password.service.ts
import { UsersRepository } from "../modules/users/users.repository.js";
import { generateToken } from "../utils/jwt.utils.js";
import { sendPasswordResetEmail } from "../services/email.service.js"; // ajuste o caminho da sua função de e-mail

interface ForgotPasswordInput {
  email: string;
}

export class ForgotPasswordService {
  constructor(private usersRepository = new UsersRepository()) {}

  async execute({ email }: ForgotPasswordInput) {
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      const resetToken = generateToken({
        id: user.id,
        email: user.email,
        purpose: 'password_reset',


        
      });

      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name,
        token: resetToken,
      });
    }

    return {
      message:
        'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.',
    };
  }
}