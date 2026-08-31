import { prisma } from "../../lib/prisma.js";

export class UsersRepository {
  /**
   * Cria um novo usuário no banco de dados.
   */
  // 1. CORREÇÃO: Adicionado isVerified na desestruturação
  async create({ name, email, password, isVerified = false }) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        isVerified, // Agora a variável existe no escopo!
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true, // 2. CORREÇÃO: Selecionado para retornar à controller
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Busca um usuário pelo e-mail.
   */
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  /**
   * Atualiza o status do e-mail do usuário para verificado.
   */
  async verifyUserEmail(id) {
    return await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }
}