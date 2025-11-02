
import type { Paciente } from "../types/paciente";
import { PacienteCard } from "./PacienteCard";

interface PacienteListProps {
  pacienteList: Paciente[];
}

export function PacienteList({ pacienteList = [] }: PacienteListProps) {
  if (pacienteList.length === 0) {
    return <p className="text-gray-500">Nenhum paciente encontrado.</p>;
  }

  return (
    // Centraliza a lista de cards
    <div className="flex flex-col items-center w-full px-4">
      {pacienteList.map((paciente) => (
        // Adicionando a prop 'key' que é essencial para o React
        <PacienteCard key={paciente.id} paciente={paciente} />
      ))}
    </div>
  );
}