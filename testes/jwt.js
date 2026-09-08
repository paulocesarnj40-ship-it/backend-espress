import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Gera um token JWT assinado.
 * @param {Object} payload - Dados armazenados no token.
 * @returns {string} Token JWT.
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Decodifica e valida um token JWT.
 * @param {string} token - Token enviado pelo cliente.
 * @returns {Object} Payload decodificado.
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
