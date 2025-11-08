import type { Deficiencia } from "./deficiencia"; // (Seu tipo de deficiencia)
import type { genero } from "./genero"; // (Seu tipo de genero)

// 1. Defina o tipo para o objeto Telefone aninhado
export interface Telefone {
  ddi: number;
  ddd: number;
  numero: number;
  tipo: string;
  status: boolean;
}

// 2. Adicione o 'telefone' ao tipo Paciente
export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string; 
  genero: genero;
  escolaridade: string;
  classificacao: number | null;
  deficiencia: Deficiencia;
  dsAcompanhante: string; // Adicionado 'dsAcompanhante'
  nrPorcentagemFalta: number | null; // Adicionado 'nrPorcentagemFalta'
  telefone: Telefone | null; // <-- ADICIONADO (Pode ser nulo se o LEFT JOIN falhar)
}