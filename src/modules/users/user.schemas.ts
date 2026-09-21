import { z } from 'zod';

// ==========================================
// Schemas Isolados (Apenas o Body)
// ==========================================

// Schema para criação de usuário
export const createUserBodySchema = z.object({
  name: z
    .string({ error: 'O nome é obrigatório' })
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),

  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .trim()
    .toLowerCase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Formato do e-mail é inválido.',
    ),

  password: z
    .string({ error: 'A senha é obrigatória' })
    .trim()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

// Schema para login
export const loginUserBodySchema = z.object({
  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .trim()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Formato de e-mail inválido',
    ),

  password: z
    .string({ error: 'A senha é obrigatória' })
    .trim()
    .min(1, { message: 'A senha não pode estar vazia' }),
});

// Schema para o corpo do reenvio
export const resendVerificationBodySchema = z.object({
  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Formato de e-mail inválido',
    ),
});

export const forgotPasswordBodySchema = z.object({
  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .trim()
    .toLowerCase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Formato de e-mail inválido',
    ),
});

export const resetPasswordBodySchema = z.object({
  token: z.string({ error: 'O token é obrigatório' }).trim(),
  newPassword: z
    .string({ error: 'A nova senha é obrigatória' })
    .trim()
    .min(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' }),
});

export const confirmEmailBodySchema = z.object({
  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .trim()
    .toLowerCase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Formato de e-mail inválido',
    ),
});

export const GetProfileQuerySchema = z.object({
  token: z.string({ error: 'O token é obrigatório' }).trim(),
}); 
// ==========================================
// Schemas Completos (Body + Query + Params)
// ==========================================
// Tipos derivados dos Schemas
// ==========================================

export type CreateUserBodyInput = z.infer<typeof createUserBodySchema>;
export type LoginUserBodyInput = z.infer<typeof loginUserBodySchema>;
export type ResendVerificationBodyInput = z.infer<
  typeof resendVerificationBodySchema
>;
export type ResetPasswordBodyInput = z.infer<typeof resetPasswordBodySchema>;
export type ForgotPasswordBodyInput = z.infer<typeof forgotPasswordBodySchema>;
export type ConfirmEmailBodyInput = z.infer<typeof confirmEmailBodySchema>;
export type GetProfileQueryInput = z.infer<typeof GetProfileQuerySchema>;
