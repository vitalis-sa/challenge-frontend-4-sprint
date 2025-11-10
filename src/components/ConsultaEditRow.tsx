import { useFormContext } from "react-hook-form";
import type { PacienteDetalheFormData } from "../schemas/detalhe-paciente-schema";

interface ConsultaEditRowProps {
  index: number; // A posição desta consulta no array
}

// Estilos (copiados do seu PacienteForm)
const inputBaseClass =
  "p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal";
const inputErrorClass = "border-red-500 bg-red-100";
const inputValidClass = "border-gray-300";

export function ConsultaEditRow({ index }: ConsultaEditRowProps) {
  // Conecta-se ao formulário principal (PacienteDetalhePage)
  const {
    register,
    formState: { errors },
  } = useFormContext<PacienteDetalheFormData>();

  // Acessa os erros desta linha específica
  const fieldErrors = errors.consultas?.[index];

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50">
      {/* Campo Data/Hora */}
      <div className="flex-1">
        <label
          htmlFor={`consultas.${index}.dataHora`}
          className="text-sm font-semibold text-roxo-escuro"
        >
          Data e Hora
        </label>
        <input
          type="datetime-local"
          id={`consultas.${index}.dataHora`}
          className={`${inputBaseClass} w-full ${
            fieldErrors?.dataHora ? inputErrorClass : inputValidClass
          }`}
          {...register(`consultas.${index}.dataHora`)}
        />
        {fieldErrors?.dataHora && (
          <p className="text-red-500 text-sm">{fieldErrors.dataHora.message}</p>
        )}
      </div>

      {/* Campo Especialidade */}
      <div className="flex-1">
        <label
          htmlFor={`consultas.${index}.especialidade`}
          className="text-sm font-semibold text-roxo-escuro"
        >
          Especialidade
        </label>
        <input
          type="text"
          id={`consultas.${index}.especialidade`}
          className={`${inputBaseClass} w-full ${
            fieldErrors?.especialidade ? inputErrorClass : inputValidClass
          }`}
          {...register(`consultas.${index}.especialidade`)}
        />
        {fieldErrors?.especialidade && (
          <p className="text-red-500 text-sm">
            {fieldErrors.especialidade.message}
          </p>
        )}
      </div>
      {/* O idPaciente é registrado, mas oculto, pois é necessário para o DTO */}
      <input type="hidden" {...register(`consultas.${index}.idPaciente`)} />
    </div>
  );
}