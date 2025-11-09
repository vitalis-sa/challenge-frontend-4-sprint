// (Estes são os tipos do ENUM do Java)
export type Deficiencia = "NENHUMA" | "MOTORA" | "INTELECTUAL";
export type Genero = "F" | "M";

// Representa o 'TelefoneDto' do Java
export interface Telefone {
  ddi: number;
  ddd: number;
  numero: number;
  tipo: string;
  status: boolean;
}

// Representa o 'TipoContato' do Java
export interface TipoContato {
  id: number;
  nome: string;
}

// Representa o 'Contato' do Java
export interface Contato {
  idContato: number;
  tipoContato: TipoContato; // Aninhado
  ddi: number | null;
  ddd: number | null;
  numeroTelefone: number | null;
}

// Representa o 'Email' do Java
export interface Email {
  id: number;
  endereco: string;
  status: string; // "A" ou "I"
}

// Este é o tipo 'Paciente' completo que a API retorna
export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string; 
  sexoBiologico: Genero; // Atualizado
  escolaridade: string;
  classificacao: number | null;
  deficiencia: Deficiencia;
  dsAcompanhante: string;
  nrPorcentagemFalta: number | null;
  
  // Objetos aninhados que vêm do backend
  telefone: Telefone | null;
  contato: Contato | null;
  email: Email | null;
}