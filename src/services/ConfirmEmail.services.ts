import { AppError } from "../errors/AppError.js";  
import { ConfirmEmailBodyInput } from "../modules/users/user.schemas.js";  
import { UsersRepository } from "../modules/users/users.repository.js";  
import { generateToken } from "../utils/jwt.utils.js";

export class ConfirmEmailService {
  constructor(private usersRepository = new UsersRepository()) {}

  async execute(data: ConfirmEmailBodyInput) {
    // 1. Verificação de e-mail existente
    const user = await this.usersRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('E-mail não encontrado.', 404);
    }

    // 2. Geração do token JWT para confirmação de e-mail
    const token = generateToken({
      id: user.id,
      email: user.email,
      purpose: 'email_confirmation',
    });

    return { token, user };
  }
}   