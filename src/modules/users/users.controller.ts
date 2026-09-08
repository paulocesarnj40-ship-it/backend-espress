import { Request, Response } from 'express';
import { ZodError } from 'zod';

import { sendVerificationEmail } from '../../services/email.service.js';
import { HashService } from '../../services/hash.services.js';
import { generateToken, verifyToken } from '../../utils/jwt.utils.js';
import {
  CreateUserBodyInput,
  createUserBodySchema,
  LoginUserBodyInput,
  loginUserBodySchema,
} from './user.schemas.js';
import { UsersRepository } from './users.repository.js';

// Interface para estender o Request do Express na rota autenticada
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Interface auxiliar para os erros do Nodemailer
interface EmailError extends Error {
  code?: string;
  command?: string;
  response?: string;
}

export class UserController {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  createUser = async (
    req: Request<{}, {}, CreateUserBodyInput>,
    res: Response,
  ): Promise<Response> => {
    try {
      // 1. Validação com Zod (req.body agora está tipado como CreateUserBodyInput)
      const { name, email, password } = createUserBodySchema.parse(req.body);

      const userExists = await this.usersRepository.findByEmail(email);
      if (userExists) {
        return res.status(409).json({ error: 'E-mail já cadastrado.' });
      }

      // 2. Hash da senha
      const hashedPassword = await HashService.generateHash(password);

      // 3. Criação no banco
      const user = await this.usersRepository.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });

      // 4. Token de verificação
      const verificationToken = generateToken({
        id: user.id,
        email: user.email,
        purpose: 'email_verification',
      });

      // 5. Envio de e-mail com diagnóstico avançado
      try {
        await sendVerificationEmail({
          to: user.email,
          userName: user.name,
          token: verificationToken,
        });
      } catch (emailError) {
        const error = emailError as EmailError;
        console.error(
          '❌ [Erro no Serviço de E-mail - Detalhes do SMTP]:',
          error,
        );

        const errorDetails = {
          code: error.code || 'UNKNOWN_ERROR',
          command: error.command,
          response: error.response,
          message: error.message,
        };

        return res.status(502).json({
          error:
            'Usuário criado com sucesso, mas houve uma falha na entrega do e-mail de ativação.',
          details:
            process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        });
      }

      // 6. Resposta de sucesso
      return res.status(201).json({
        message:
          'Usuário criado com sucesso! Por favor, verifique seu e-mail para ativar sua conta.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('❌ [UserController.createUser]:', error);
        return res.status(400).json({
          error: 'Dados inválidos......',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      console.error('❌ [UserController.createUser]:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

  loginUser = async (
    req: Request<{}, {}, LoginUserBodyInput>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email, password } = loginUserBodySchema.parse(req.body);
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const isPasswordValid = await HashService.compareHash(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          error:
            'Sua conta ainda não foi ativada. Por favor, verifique seu e-mail.',
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
      });

      return res.status(200).json({
        message: 'Login efetuado com sucesso!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('❌ [UserController.loginUser]:', error);
        return res.status(400).json({
          error: 'Dados inválidos.',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      console.error('❌ [UserController.loginUser]:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

  confirmEmail = async (
    req: Request<{}, {}, {}, { token?: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Token não fornecido.' });
      }

      const decoded = verifyToken(token) as {
        id: number;
        email: string;
        purpose: string;
      };

      if (decoded.purpose !== 'email_verification') {
        return res
          .status(400)
          .json({ error: 'Token inválido para esta operação.' });
      }

      await this.usersRepository.verifyUserEmail(decoded.id);

      return res.status(200).json({
        message: 'E-mail confirmado com sucesso! Você já pode fazer login.',
      });
    } catch (error) {
      console.error('❌ [UserController.confirmEmail]:', error);
      return res
        .status(400)
        .json({ error: 'Link de confirmação inválido ou expirado.' });
    }
  };

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> => {
    try {
      if (!req.user?.email) {
        return res.status(401).json({ error: 'Não autorizado.' });
      }

      const user = await this.usersRepository.findByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.status(200).json({
        message: 'Acesso perfil permitido',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error('❌ [UserController.getProfile]:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

  resendVerificationEmail = async (
    req: Request<{}, {}, { email: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email } = req.body;

      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: 'Este e-mail já foi ativado.' });
      }

      const verificationToken = generateToken({
        id: user.id,
        email: user.email,
        purpose: 'email_verification',
      });

      await sendVerificationEmail({
        to: user.email,
        userName: user.name,
        token: verificationToken,
      });

      return res.status(200).json({
        message: 'Novo e-mail de verificação enviado com sucesso!',
      });
    } catch (error) {
      console.error('❌ [UserController.resendVerificationEmail]:', error);
      return res
        .status(500)
        .json({ error: 'Erro ao reenviar o e-mail de verificação.' });
    }
  };
}
