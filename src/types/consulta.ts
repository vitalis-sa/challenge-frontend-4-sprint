import type { Paciente } from "./paciente";

export type Consulta = {
  id: number;
  dataHora: string; // (string ISO vinda do backend)
  especialidade: string;
  paciente: Paciente; // Objeto paciente aninhado
};