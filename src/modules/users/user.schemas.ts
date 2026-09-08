import { z } from 'zod';

// ==========================================
// Schemas Isolados (Apenas o Body)
// ==========================================

// Schema para criação de usuário
export const createUserBodySchema = z.object({
  name: z
    .string({ error: 'O nome é obrigatório' })
    .trim()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),

  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .email({ message: 'Formato do e-mail é inválido' }),

  password: z
    .string({ error: 'A senha é obrigatória' })
    .trim()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

// Schema para login
export const loginUserBodySchema = z.object({
  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .email({ message: 'O formato do e-mail é inválido' }),

  password: z
    .string({ error: 'A senha é obrigatória' })
    .trim()
    .min(1, { message: 'A senha não pode estar vazia' }),
});

// Schema para o corpo do reenvio
export const resendVerificationBodySchema = z.object({
  email: z
    .string({ error: 'O e-mail é obrigatório' })
    .email({ message: 'Formato de e-mail inválido' }),
});

// ==========================================
// Schemas para o Middleware de Validação (Com objeto 'body')
// ==========================================

//export const createUserSchema = z.object({
//  body: createUserBodySchema,
//});

//export const loginUserSchema = z.object({
// body: loginUserBodySchema,
//});

// ==========================================
// Inferência de Tipos TypeScript
// ==========================================

export type CreateUserBodyInput = z.infer<typeof createUserBodySchema>;
export type LoginUserBodyInput = z.infer<typeof loginUserBodySchema>;
export type ResendVerificationBodyInput = z.infer<
  typeof resendVerificationBodySchema
>;
