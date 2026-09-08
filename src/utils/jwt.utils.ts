// @ts-expect-error jsonwebtoken does not ship declarations in this project.
import jwt from 'jsonwebtoken';

type JwtPayload = Record<string, unknown>;
type Secret = string;
type ExpiresIn = string | number;

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
const JWT_EXPIRES_IN: ExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Gera um token JWT assinado.
 * @param payload - Dados armazenados no token.
 * @returns Token JWT string.
 */
export function generateToken(payload: string | Buffer | object): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Decodifica e valida um token JWT.
 * @param token - Token enviado pelo cliente.
 * @returns Payload decodificado (objeto ou string).
 */
export function verifyToken<T extends object | string = JwtPayload | string>(
  token: string,
): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
