import { AppError } from "../errors/AppError.js";
import { LoginUserBodyInput } from "../modules/users/user.schemas.js";
import { UsersRepository } from "../modules/users/users.repository.js";
import { generateToken } from "../utils/jwt.utils.js";
import { HashService } from "./hash.services.js";

export class LoginUserService {
  constructor(private usersRepository = new UsersRepository()) {}

  async execute(data: LoginUserBodyInput) {
    // 1. Verificação de e-mail existente
    const user = await this.usersRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    // 2. Verificação de senha
    const isPasswordValid = await HashService.compareHash(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    // 3. Geração do token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      purpose: 'user_authentication',
    });

    return { token, user };
  }
}