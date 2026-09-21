import { User } from '../../generated/prisma/client/edge.js';
import { prisma } from '../../lib/prisma.js';
import { verifyToken } from '../../utils/jwt.utils.js';

// Interface para os dados de criação de usuário
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  isVerified?: boolean;
}

export class UsersRepository {
  async findByToken(token: string) {
    try {
      const decoded = verifyToken<{ id: string; email: string }>(token);

      if (!decoded?.id) {
        return null;
      }

      const id = Number(decoded.id);

      if (!Number.isInteger(id)) {
        return null;
      }

      return await prisma.user.findUnique({
        where: { id },
      });
    } catch {
      return null;
    }
  }
  /**
   * Cria um novo usuário no banco de dados.
   */
  async create({ name, email, password, isVerified = false }: CreateUserInput) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        isVerified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Busca um usuário pelo e-mail.
   */
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  /**
   * Atualiza o status do e-mail do usuário para verificado.
   */
  async verifyUserEmail(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  async deleteById(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
