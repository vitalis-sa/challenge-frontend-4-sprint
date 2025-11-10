import { z } from "zod";

// 1. O SCHEMA DO FORMULÁRIO (PLANO)
export const pacienteSchema = z.object({
  // Campos do Paciente
  nome: z.string().min(3, "Nome é obrigatório"),
  cpf: z
    .string()
    .length(11, "CPF deve ter 11 dígitos")
    .regex(/^[0-9]+$/, "CPF deve conter apenas números"),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  sexoBiologico: z.enum(["F", "M"], {
    message: "Selecione o sexo",
  }),
  escolaridade: z.string().min(3, "Escolaridade é obrigatória"),
  deficiencia: z.enum(["NENHUMA", "MOTORA", "INTELECTUAL"], {
    message: "Selecione a deficiência",
  }),
  dsAcompanhante: z.enum(["S", "N"], {
    message: "Selecione se há acompanhante",
  }),
  
  // Campos de Telefone
  telefoneNumero: z
    .string()
    .min(10, "Telefone deve ter 10 ou 11 dígitos (DDD + Número)")
    .max(11, "Telefone deve ter 10 ou 11 dígitos")
    .regex(/^[0-9]+$/, "Telefone deve conter apenas números"),
  telefoneTipo: z.enum(["Celular", "Residencial", "Comercial"], {
    message: "Selecione o tipo de telefone",
  }),

  // --- NOVOS CAMPOS ADICIONADOS ---

  // Campos de Email
  emailEndereco: z
    .string()
    .email("Formato de e-mail inválido")
    .min(1, "E-mail é obrigatório"),

  // Campos de Contato
  contatoNomeTipo: z
    .string()
    .min(2, "O tipo de contato é obrigatório (ex: Mãe, Parente)"),
  contatoTelefoneNumero: z
    .string()
    .min(10, "Telefone do contato é obrigatório (DDD + Número)")
    .max(11, "Telefone do contato deve ter 10 ou 11 dígitos")
    .regex(/^[0-9]+$/, "Telefone deve conter apenas números"),
});

// Este tipo é gerado do schema acima (o que o react-hook-form usa)
export type PacienteFormData = z.infer<typeof pacienteSchema>;


// --- 2. NOVOS TIPOS (PAYLOAD DA API) ---
// (Estes definem o JSON que o backend Java espera)

export interface TelefoneApiPayload {
  ddi: number;
  ddd: number;
  numero: number;
  tipo: string;
  status: boolean;
}

export interface ContatoApiPayload {
  nomeTipoContato: string;
  ddi: number;
  ddd: number;
  numeroTelefone: number;
}

export interface EmailApiPayload {
  endereco: string;
  status: string;
}

// Este é o JSON final que será enviado no POST
export interface PacienteApiPayload {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexoBiologico: string;
  escolaridade: string;
  deficiencia: string;
  dsAcompanhante: string;
  telefone: TelefoneApiPayload;
  contato: ContatoApiPayload;
  email: EmailApiPayload;
}