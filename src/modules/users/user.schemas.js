import {z} from "zod";

// Schema para criação de usuário
export const createUserSchema = z.object({
    name:z
        .string({required_error: "O nome é obrigatório"})
        .trim()
        .min(3, {message:"O nome deve ter no mínimo 3 caracteres"}),

    email:z
        .string({required_error: "Formato de email é invalido"})
        .email({message: "Formato do email é invalido"}),

    password: z
        .string({required_error: "A senha é obrigatória"})
        .trim()
        .min(6, {message: "A senha deve ter no mínimo 6 caracteres"})
});

//Schema para login
export const loginUserSchema = z.object({
    email: z
        .string({required_error:"O e-mail é obrigatório"})
        .email({ message: "O formato do e-mail é invalido"}),

    password: z
        .string({required_error: "A senha é obrigatória"})
        .trim()
        .min(1, {message: "A senha não pode estar vazia"})
});
