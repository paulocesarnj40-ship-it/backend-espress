import { ZodError } from "zod";

import { HashService } from "../../services/hash.services.js";
import { UsersRepository } from "./users.repository.js";
import { createUserSchema, loginUserSchema } from "./user.schemas.js";
// 1. CORREÇÃO: Adicionado verifyToken à importação do JWT
import { generateToken, verifyToken } from "../../utils/jwt.utils.js"; 
import { sendVerificationEmail } from "../../services/email.service.js";

export class UserController {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  createUser = async (req, res) => {
    try {
      // 1. Validação com Zod
      const { name, email, password } = createUserSchema.parse(req.body);

      const userExists = await this.usersRepository.findByEmail(email);
      if (userExists) {
        return res.status(409).json({ error: "E-mail já cadastrado." });
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
        purpose: "email_verification",
      });

      // 5. Envio de e-mail com tratamento isolado
     // 5. Envio de e-mail com diagnóstico avançado
try {
  await sendVerificationEmail({
    to: user.email,
    userName: user.name,
    token: verificationToken,
  });
} catch (emailError) {
  // Log completo para o terminal (imprime todo o objeto de erro)
  console.error("❌ [Erro no Serviço de E-mail - Detalhes do SMTP]:", emailError);

  // Mapeamento de erros conhecidos do Nodemailer para diagnóstico rápido
  const errorDetails = {
    code: emailError.code || "UNKNOWN_ERROR",
    command: emailError.command,
    response: emailError.response,
    message: emailError.message,
  };

  // Se o erro for de autenticação (EAUTH) ou conexão (ESOCKET)
  return res.status(502).json({
    error: "Usuário criado com sucesso, mas houve uma falha na entrega do e-mail de ativação.",
    details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
  });
}
      // 6. Resposta de sucesso
      return res.status(201).json({
        message: "Usuário criado com sucesso! Por favor, verifique seu e-mail para ativar sua conta.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos.",
          details: (error.issues || error.errors || []).map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      console.error("❌ [UserController.createUser]:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  };
// Envio de email funccionando
  loginUser = async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const isPasswordValid = await HashService.compareHash(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          error: "Sua conta ainda não foi ativada. Por favor, verifique seu e-mail.",
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
      });

      return res.status(200).json({
        message: "Login efetuado com sucesso!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos.",
          details: (error.issues || error.errors || []).map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      console.error("❌ [UserController.loginUser]:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

  confirmEmail = async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: "Token não fornecido." });
      }

      // A função verifyToken agora está corretamente importada no topo
      const decoded = verifyToken(token);

      if (decoded.purpose !== "email_verification") {
        return res.status(400).json({ error: "Token inválido para esta operação." });
      }

      await this.usersRepository.verifyUserEmail(decoded.id);

      return res.status(200).json({ message: "E-mail confirmado com sucesso! Você já pode fazer login." });
    } catch (error) {
      console.error("❌ [UserController.confirmEmail]:", error);
      return res.status(400).json({ error: "Link de confirmação inválido ou expirado." });
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await this.usersRepository.findByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json({
        message: "Acesso perfil permitido",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("❌ [UserController.getProfile]:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  };
}