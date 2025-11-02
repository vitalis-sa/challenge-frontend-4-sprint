import { z } from "zod";

export const pacienteSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(80, "O nome deve ter no máximo 80 caracteres"),

  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos, sem pontos ou traços"),

  dataNascimento: z
    .string()
    .min(1, "A data de nascimento é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use AAAA-MM-DD")
    .refine(
      (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dateStr) < today;
      },
      {
        message: "A data de nascimento deve estar no passado",
      }
    ),

  sexoBiologico: z.enum(["F", "M"], {

    message: "Sexo biológico deve ser 'F' ou 'M'",
  }),

  escolaridade: z
    .string()
    .min(1, "Escolaridade é obrigatória")
    .max(40, "Escolaridade deve ter no máximo 40 caracteres"),

  classificacao: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),

  deficiencia: z
    .number()
    .int()
    .min(0, "Código de deficiência inválido")
    .max(3, "Código de deficiência inválido"),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;