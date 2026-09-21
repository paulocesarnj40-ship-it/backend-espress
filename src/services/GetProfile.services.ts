import { AppError } from "../errors/AppError.js";
import { GetProfileQueryInput } from "../modules/users/user.schemas.js";
import { UsersRepository } from "../modules/users/users.repository.js";

export class GetProfileService {
  constructor(private usersRepository = new UsersRepository()) {}

  async execute(data: GetProfileQueryInput) {
    // 1. Verificação do token JWT
    const user = this.usersRepository.findByToken(data.token);
    if (user === undefined) {
      throw new AppError('Token inválido ou expirado.', 401);
    }

    // 2. Retorna o perfil do usuário
    return { user };
  }
}   