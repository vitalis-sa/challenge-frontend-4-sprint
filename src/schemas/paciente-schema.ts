// src/schemas/pacienteSchema.ts
import { z } from "zod";

// Baseado no PacienteDao (setParametrosPaciente)
export const pacienteSchema = z.object({
  // 1. NM_PACIENTE
  nome: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(80, "O nome deve ter no máximo 80 caracteres"),

  // 2. NR_CPF
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos, sem pontos ou traços"),

  // 3. DT_NASCIMENTO
  dataNascimento: z
    .string()
    .min(10, "Data de nascimento é obrigatória") // "AAAA-MM-DD"
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use AAAA-MM-DD")
    .refine(
      (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera a hora
        return new Date(dateStr) < today;
      },
      { message: "A data de nascimento deve estar no passado" }
    ),

  // 4. FL_SEXO_BIOLOGICO
  sexoBiologico: z.enum(["F", "M"], { message: "Selecione 'F' ou 'M'" }),

  // 5. DS_ESCOLARIDADE
  escolaridade: z
    .string()
    .min(1, "Escolaridade é obrigatória")
    .max(40, "Escolaridade deve ter no máximo 40 caracteres"),

  // 6. TP_DEFICIENCIA (VARCHAR - ex: "MOTORA", "SEM DEF")
  deficiencia: z.enum(["NENHUMA", "MOTORA", "INTELECTUAL"], { 
      message: "Selecione o tipo de deficiência" 
  }),

  // 7. DS_ACOMPANHANTE
  dsAcompanhante: z.enum(["S", "N"], { message: "Selecione 'S' ou 'N'" }),

  // 8. NR_CLASSIFICACAO (NUMBER 1,0 - Nullable)
  classificacao: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),

  // 9. NR_PORCENTAGEM_FALTA (NUMBER 3,0 - Nullable)
  nrPorcentagemFalta: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .nullable(),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;