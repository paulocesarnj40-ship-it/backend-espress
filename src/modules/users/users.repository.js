import { prisma } from "../../lib/prisma.js";

export class UsersRepository {
  /**
   * Cria um novo usuário no banco de dados.
   */
  async create({ name, email, password }) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // A senha deve vir tratada/criptografada antes de chamar o repositório
        isVerified, // Salva o status de verificação
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
        // Omitimos a senha no retorno por segurança
      },
    });

    return user;
  }

  /**
   * Busca um usuário pelo e-mail.
   * Retorna o usuário completo (incluindo o hash da senha para verificação posterior)
   * ou null caso não encontre.
   */
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}