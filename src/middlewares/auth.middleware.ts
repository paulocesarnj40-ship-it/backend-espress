import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.js';

// Interface com os dados que vêm dentro do JWT
export interface TokenPayload {
  id: string;
  email: string;
}

/**
 * Middleware para autenticação via JWT.
 * teste
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de acesso não fornecido.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado.' });
  }

  try {
    // Assegura que o retorno do utilitário contém a tipagem correta
    const decoded = verifyToken(token) as TokenPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
