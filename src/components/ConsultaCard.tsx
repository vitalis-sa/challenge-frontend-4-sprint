import type { Consulta } from "../types/consulta";

interface ConsultaCardProps {
  consulta: Consulta;
}

export function ConsultaCard({ consulta }: ConsultaCardProps) {

  // Formata a data e hora da consulta (ex: 20/11/2025 às 14:30)
  const dataHoraFormatada = new Date(consulta.dataHora).toLocaleDateString('pt-BR', {
    timeZone: 'UTC', // Lembre-se que o backend manda sem fuso
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', ' às');

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-azul-principal">
        {consulta.especialidade}
      </h3>
      <p className="text-gray-600">
        <span className="font-semibold">Data e Hora:</span> {dataHoraFormatada}
      </p>
      {/* O backend já aninha o paciente, mas não precisamos mostrar aqui
          já que estamos na página do próprio paciente. 
          <p>Paciente: {consulta.paciente.nome}</p> 
      */}
    </div>
  );
}