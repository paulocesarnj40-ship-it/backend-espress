import { AppError } from "../errors/AppError.js";
import { CreateUserBodyInput } from "../modules/users/user.schemas.js";
import { UsersRepository } from "../modules/users/users.repository.js";
import { generateToken } from "../utils/jwt.utils.js";
import { sendVerificationEmail } from "./email.service.js";
import { HashService } from "./hash.services.js";

export class CreateUserService {
  constructor(private usersRepository = new UsersRepository()) {}

  async execute(data: CreateUserBodyInput) {
    // 1. Verificação de e-mail duplicado
    const userExists = await this.usersRepository.findByEmail(data.email);
    if (userExists) {
      // O errorHandler capturará isso no bloco "if (err instanceof AppError)" com status 409
      throw new AppError('E-mail já cadastrado.', 409);
    }

    // 2. Criptografia de senha
    const hashedPassword = await HashService.generateHash(data.password);

    // 3. Criação do usuário
    const user = await this.usersRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      isVerified: false,
    });

    // 4. Geração do token de verificação
    const verificationToken = generateToken({
      id: user.id,
      email: user.email,
      purpose: 'email_verification',
    });

    // 5. Envio do e-mail de ativação
    try {
      await sendVerificationEmail({
        to: user.email,
        userName: user.name,
        token: verificationToken,
      });
    } catch (emailError: any) {
      // Exibe a falha real de rede/SMTP no terminal do backend para auditoria
      console.error('❌ [Email Sending Error]:', emailError);

      // O errorHandler capturará isso e enviará a chave 'details' configurada
      throw new AppError(
        'Usuário criado com sucesso, mas houve uma falha na entrega do e-mail de ativação.',
        502,
        process.env.NODE_ENV === 'development' ? emailError.message : undefined
      );
    }

    return user;
  }
}