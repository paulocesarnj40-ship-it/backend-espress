import bcrypt from 'bcrypt';

export class HashService {
  static SALT_ROUNDS = 10;

  /**
   * Criptografa uma senha em texto plano
   */
  static async generateHash(password) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara uma senha informada com o hash salvo no banco
   */
  static async compareHash(password, hashed) {
    return bcrypt.compare(password, hashed);
  }
}