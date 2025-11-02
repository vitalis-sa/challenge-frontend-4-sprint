// src/components/PacienteCard.tsx

import { Link } from "react-router-dom";
import { usePacientes } from "../context/PacienteContext";
import type { Paciente } from "../types/paciente";

interface PacienteCardProps {
  paciente: Paciente;
}

export function PacienteCard({ paciente }: PacienteCardProps) {
  // Usando o hook customizado
  const { removePaciente } = usePacientes();

  // Formata a data para exibição (ex: 20/10/1985)
  const dataNascFormatada = new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', {
    timeZone: 'UTC' // Importante para evitar bugs de fuso horário
  });

  return (
    <div className="w-full max-w-2xl rounded-lg shadow px-4 py-4 flex flex-col gap-3 mb-3 bg-white">
      <div className="flex justify-between items-start">
        {/* Informações do Paciente */}
        <div>
          <h2 className="text-xl font-bold text-gray-700">{paciente.nome}</h2>
          <p className="text-sm text-gray-500">CPF: {paciente.cpf}</p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-2 items-center justify-center">
          <Link
            to={`/pacientes/${paciente.id}`} // Rota de detalhes
            state={{ paciente }}
            className="text-blue-600 font-bold hover:underline rounded border border-blue-600 px-3 py-1 text-sm"
          >
            Detalhes
          </Link>

          <button
            onClick={() => removePaciente(paciente.id)}
            className="bg-red-600 border text-white rounded px-3 py-1 text-sm"
          >
            Remover Paciente
          </button>
        </div>
      </div>

      {/* Outras Informações */}
      <div className="border-t pt-2">
        <h3 className="text-gray-600">
          <span className="font-semibold">Nascimento:</span> {dataNascFormatada}
        </h3>
        <h3 className="text-gray-600">
          <span className="font-semibold">Escolaridade:</span> {paciente.escolaridade}
        </h3>
        <h3 className="text-gray-600">
           <span className="font-semibold">Deficiência:</span> {paciente.deficiencia}
        </h3>
      </div>
    </div>
  );
}