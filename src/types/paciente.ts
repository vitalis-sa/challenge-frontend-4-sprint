import type { Deficiencia } from "./deficiencia";
import type { genero } from "./genero";

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string; // O backend serializa LocalDate/Date para string (ex: "1990-10-20")
  genero: genero;
  escolaridade: string;
  classificacao: number | null; // O campo era Integer no DTO, então pode ser nulo
  deficiencia: Deficiencia;
  dsAcompanhante:string
  nrPorcentagemFalta: number
}