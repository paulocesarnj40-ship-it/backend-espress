import { ZodError } from "zod";

import { HashService } from "../../services/hash.services.js";
import { UsersRepository } from "./users.repository.js";
import {createUserSchema, loginUserSchema} from "./user.schemas.js";
import { generateToken } from "../../utils/jwt.utils.js";
import { sendVerificationEmail} from "../../services/email.service.js";

export class UserController{
  constructor() {
    this.usersRepository = new UsersRepository();
  }
    async createUser(req, res){
      
        try {
                // 1. Valida o corpo da requisição contra o schema do Zod
                const{name, email, password} = createUserSchema.parse(req.body);

                const userExists = await this.usersRepository.findByEmail(email);
                    if (userExists) {
                      return res.status(409).json({ error: "E-mail já cadastrado." });
                    }

                  // 🔒 2. Gera o hash seguro da senha via HashService
                const hashedPassword = await HashService.generateHash(password);

                // 2. Cria o usuário no repositório com os dados já validados
                const user = await this.usersRepository.create({
                  name,
                  email,
                  password:hashedPassword,
                  isVerified:false,
                });
                

                // CORREÇÃO: Gera o token JWT específico para verificação de e-mail
                const verificationToken = generateToken({
                  id: user.id,
                  email: user.email,
                  purpose: "email_verification",
                });


                // Envio limpo delegando a responsabilidade ao serviço
                await sendVerificationEmail({
                      to: user.email,
                      userName: user.name,
                      token: verificationToken,
                    });

                // 3. Retorna a resposta de sucesso sem expor a senha
                return res.status(201).json({
                user: { 
                    id: user.id,
                    name,
                    email,
                },
           });
        } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos.",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
      }

      console.error("[UserController.createUser]:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
        }
    
async loginUser(req, res) {
    try {
      // 1. Validação com Zod
      const { email, password } = loginUserSchema.parse(req.body);

      // 2. Busca o usuário no banco usando o repositório
      const user = await this.usersRepository.findByEmail(email);

      // 3. Valida se o usuário existe
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // 4. Valida a senha usando o HashService
      const isPasswordValid = await HashService.compareHash(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
      })

      // 5. Retorno de sucesso
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
          // 💡 Correção: Usa `error.issues` com fallback seguro `|| []`
          details: (error.issues || error.errors || []).map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      console.error("[UserController.loginUser]:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }

    
  }

  async getProfile(req, res) {
    try {
      const user = await this.usersRepository.findByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json({
        message:"Acesso perfil permitido",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("[UserController.getProfile]:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
    
}