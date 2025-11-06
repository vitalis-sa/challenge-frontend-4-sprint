import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hooks de Contexto
import { usePacientes } from "../context/PacienteContext"; // <-- Pega a lista de pacientes
import { useConsultas } from "../context/ConsultaContext"; // <-- Salva a consulta

// Schema Zod
import {
  consultaSchema,
  type ConsultaFormData,
} from "../schemas/consulta-schema";

export function ConsultaForm() {
  // 1. Hook para salvar a consulta
  const { saveConsulta } = useConsultas();
  
  // 2. Hook para buscar os pacientes (para o dropdown)
  const { pacientes, fetchPacientes } = usePacientes();
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema),
  });

  // 3. Busca a lista de pacientes quando o componente montar
  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  // --- onSubmit ATUALIZADO ---
  async function onSubmit(data: ConsultaFormData): Promise<void> {
    
    const dadosParaApi = {
      ...data,
      dataHora: `${data.dataHora}:00`,
    };
    // ------------------------

    console.log("Objeto Consulta a ser enviado:", dadosParaApi); // Log com os dados formatados
    try {
      // Envia os dados formatados
      await saveConsulta(dadosParaApi); 
      
      alert("Consulta agendada com sucesso!");
      reset(); 
      navigate("/pacientes"); // Redireciona para a lista de pacientes (ou outra página)
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      alert("Erro ao agendar consulta. Tente novamente.");
    }
  }

  // Estilos (copiados do seu PacienteForm)
  const inputBaseClass =
    "p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal";
  const inputErrorClass = "border-red-500 bg-red-100";
  const inputValidClass = "border-gray-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      
      {/* 1. O Dropdown de Pacientes */}
      <label htmlFor="idPaciente" className="font-semibold text-roxo-escuro">
        Paciente
      </label>
      <select
        id="idPaciente"
        className={`${inputBaseClass} ${
          errors.idPaciente ? inputErrorClass : inputValidClass
        }`}
        {...register("idPaciente", { valueAsNumber: true })} 
        defaultValue=""
      >
        <option value="" disabled>
          Selecione um paciente...
        </option>
        {pacientes.map((paciente) => (
          <option key={paciente.id} value={paciente.id}>
            {paciente.nome} (CPF: {paciente.cpf})
          </option>
        ))}
      </select>
      {errors.idPaciente && (
        <p className="text-red-500 text-sm">{errors.idPaciente.message}</p>
      )}

      {/* 2. Especialidade */}
      <label htmlFor="especialidade" className="font-semibold text-roxo-escuro">
        Especialidade
      </label>
      <input
        type="text"
        id="especialidade"
        placeholder="Cardiologia"
        className={`${inputBaseClass} ${
          errors.especialidade ? inputErrorClass : inputValidClass
        }`}
        {...register("especialidade")}
      />
      {errors.especialidade && (
        <p className="text-red-500 text-sm">{errors.especialidade.message}</p>
      )}

      {/* 3. Data e Hora */}
      <label htmlFor="dataHora" className="font-semibold text-roxo-escuro">
        Data e Hora da Consulta
      </label>
      <input
        type="datetime-local" // Input nativo para data e hora
        id="dataHora"
        className={`${inputBaseClass} ${
          errors.dataHora ? inputErrorClass : inputValidClass
        }`}
        {...register("dataHora")}
      />
      {errors.dataHora && (
        <p className="text-red-500 text-sm">{errors.dataHora.message}</p>
      )}

      {/* Botão */}
      <button
        type="submit"
        className="p-3 mt-4 rounded-lg bg-verde-escuro text-quase-branco font-semibold hover:bg-[#00352c] transition-colors"
      >
        Agendar Consulta
      </button>
    </form>
  );
}