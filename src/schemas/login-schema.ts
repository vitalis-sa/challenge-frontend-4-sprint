import { z } from "zod";

// Schema Zod para o formulário de login com CPF
export const loginSchema = z.object({
  cpf: z
    .string()
    .min(1, "O CPF é obrigatório.")
    .length(11, "O CPF deve ter exatamente 11 dígitos.")
    .regex(/^[0-9]+$/, "O CPF deve conter apenas números."),
});

// Tipo gerado a partir do schema
export type LoginFormData = z.infer<typeof loginSchema>;