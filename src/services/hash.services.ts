// bcrypt does not ship TypeScript declarations in this project.
// @ts-expect-error The package is used through its JavaScript API.
import bcrypt from 'bcrypt';

export class HashService {
  static readonly SALT_ROUNDS: number = 10;

  /**
   * Criptografa uma senha em texto plano
   */
  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara uma senha informada com o hash salvo no banco
   */
  static async compareHash(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
