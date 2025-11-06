import { z } from "zod";

export const consultaSchema = z.object({
  // CORRIGIDO: Mudamos de z.coerce.number() para z.number()
  idPaciente: z
    .number({
    })
    .int()
    .min(1, "Selecione um paciente."), // min(1) já trata o "0" (valor do "Selecione...")

  especialidade: z
    .string()
    .min(1, "A especialidade é obrigatória.")
    .min(3, "A especialidade deve ter no mínimo 3 caracteres."),

  dataHora: z
    .string()
    .min(1, "A data e hora são obrigatórias.")
    .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data e hora inválidas.",
    }),
});

export type ConsultaFormData = z.infer<typeof consultaSchema>;