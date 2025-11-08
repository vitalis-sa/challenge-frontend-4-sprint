import { z } from "zod";

// 1. O SCHEMA FOI ATUALIZADO
export const pacienteSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório"),
  cpf: z
    .string()
    .length(11, "CPF deve ter 11 dígitos")
    .regex(/^[0-9]+$/, "CPF deve conter apenas números"),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida"),

  // --- CORRIGIDO ---
  sexoBiologico: z.enum(["F", "M"], {
    message: "Selecione o sexo",
  }),

  escolaridade: z.string().min(3, "Escolaridade é obrigatória"),

  // --- CORRIGIDO ---
  deficiencia: z.enum(["NENHUMA", "MOTORA", "INTELECTUAL"], {
    message: "Selecione a deficiência",
  }),

  // --- CORRIGIDO ---
  dsAcompanhante: z.enum(["S", "N"], {
    message: "Selecione se há acompanhante",
  }),
  
  // --- CAMPOS DE TELEFONE ADICIONADOS AO FORMULÁRIO ---
  telefoneNumero: z
    .string()
    .min(10, "Telefone deve ter 10 ou 11 dígitos (DDD + Número)")
    .max(11, "Telefone deve ter 10 ou 11 dígitos")
    .regex(/^[0-9]+$/, "Telefone deve conter apenas números"),
  
  // --- CORRIGIDO ---
  telefoneTipo: z.enum(["Celular", "Residencial", "Comercial"], {
    message: "Selecione o tipo de telefone",
  }),
});

// Este tipo agora é inferido do schema atualizado (inclui telefoneNumero e telefoneTipo)
export type PacienteFormData = z.infer<typeof pacienteSchema>;

// --- 3. NOVOS TIPOS QUE REPRESENTAM O JSON DA API ---
// (Estes são os DTOs do seu backend Java)

// Representa o 'TelefoneDto' aninhado
export interface TelefoneApiPayload {
  ddi: number;
  ddd: number;
  numero: number;
  tipo: string;
  status: boolean;
}

// Representa o 'CadastroPacienteDto' (o JSON que a API espera)
export interface PacienteApiPayload {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexoBiologico: string;
  escolaridade: string;
  deficiencia: string;
  dsAcompanhante: string;
  telefone: TelefoneApiPayload; // <-- O objeto aninhado
}