import type { Paciente } from "../types/paciente";
import { PacienteCard } from "./PacienteCard";

interface PacienteListProps {
  pacienteList: Paciente[];
}

export function PacienteList({ pacienteList = [] }: PacienteListProps) {
  if (pacienteList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-50 rounded-lg border">
         <p className="text-lg font-medium text-gray-700">Nenhum paciente encontrado.</p>
         <p className="text-gray-500">Cadastre um novo paciente para começar.</p>
      </div>
    );
  }

  return (
    // ALTERADO: De 'flex flex-col' para 'grid'
    // 1. Padrão de 1 coluna em telas pequenas
    // 2. md:grid-cols-2: 2 colunas em telas médias
    // 3. xl:grid-cols-3: 3 colunas em telas grandes (combinando com o max-w-6xl da página)
    // 4. gap-6: Espaçamento consistente entre os cards
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {pacienteList.map((paciente) => (
        <PacienteCard key={paciente.id} paciente={paciente} />
      ))}
    </div>
  );
}