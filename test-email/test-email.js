// 1. Solicitação de recuperação (Forgot Password)
  forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordBodyInput>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email } = forgotPasswordBodySchema.parse(req.body);

      const user = await this.usersRepository.findByEmail(email);

      // Prática de Segurança: Retornar 200 genérico mesmo se o usuário não existir
      // para evitar Enumeração de E-mails (Email Enumeration Attack).
      if (!user) {
        return res.status(200).json({
          message: 'Se o e-mail estiver cadastrado, você receberá as instruções de redefinição.',
        });
      }

      // Gera o JWT com finalidade restrita de reset de senha e expiração curta (ex: 15min ~ 1h no utilitário)
      const resetToken = generateToken({
        id: user.id,
        email: user.email,
        purpose: 'password_reset',
      });

      try {
        await sendPasswordResetEmail({
          to: user.email,
          userName: user.name,
          token: resetToken,
        });
      } catch (emailError) {
        const error = emailError as EmailError;
        console.error('❌ [UserController.forgotPassword - SMTP Error]:', error);
        return res.status(502).json({
          error: 'Falha no envio do e-mail de recuperação de senha.',
        });
      }

      return res.status(200).json({
        message: 'Se o e-mail estiver cadastrado, você receberá as instruções de redefinição.',
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      console.error('❌ [UserController.forgotPassword]:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

  // 2. Redefinição efetiva da senha (Reset Password)
  resetPassword = async (
    req: Request<{}, {}, ResetPasswordBodyInput>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { token, newPassword } = resetPasswordBodySchema.parse(req.body);

      // Validação do JWT de recuperação
      const decoded = verifyToken(token) as {
        id: string | number;
        email: string;
        purpose: string;
      };

      if (decoded.purpose !== 'password_reset') {
        return res.status(400).json({ error: 'Token inválido para redefinição de senha.' });
      }

      const user = await this.usersRepository.findByEmail(decoded.email);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Hash da nova senha
      const hashedPassword = await HashService.generateHash(newPassword);

      // Atualização no banco (Certifique-se que seu repository possui updatePassword)
      await this.usersRepository.updatePassword(user.id, hashedPassword);

      return res.status(200).json({
        message: 'Senha alterada com sucesso! Você já pode realizar o login com a nova senha.',
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      console.error('❌ [UserController.resetPassword]:', error);
      return res.status(400).json({ error: 'Link de redefinição inválido ou expirado.' });
    }
  };