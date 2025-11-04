// src/components/PacienteForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePacientes } from "../context/PacienteContext"; // Importa o hook do Paciente
import {
  pacienteSchema,
  type PacienteFormData,
} from "../schemas/paciente-schema";
import { useNavigate } from "react-router-dom"; // Para redirecionar após o cadastro

export function PacienteForm() {
  const { savePaciente } = usePacientes();
  const navigate = useNavigate(); // Hook para navegação

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
  });

  async function onSubmit(data: PacienteFormData): Promise<void> {
    // A API (e o DTO) espera 'deficiencia' como string ("MOTORA", etc.)
    // e 'classificacao'/'nrPorcentagemFalta' como números (ou null),
    // o Zod schema já garante isso.
    console.log("Objeto Paciente a ser enviado:", data);
    try {
      await savePaciente(data);
      alert("Paciente cadastrado com sucesso!");
      reset(); // Limpa o formulário
      navigate("/pacientes"); // Redireciona para a lista de pacientes
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Erro ao cadastrar paciente. Tente novamente.");
    }
  }

  // Estilo de classe base para os inputs (do seu SignUp.tsx)
  const inputBaseClass =
    "p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal";
  const inputErrorClass = "border-red-500 bg-red-100";
  const inputValidClass = "border-gray-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Nome */}
      <label htmlFor="nome" className="font-semibold text-roxo-escuro">
        Nome
      </label>
      <input
        type="text"
        id="nome"
        placeholder="Nome completo do paciente"
        className={`${inputBaseClass} ${
          errors.nome ? inputErrorClass : inputValidClass
        }`}
        {...register("nome")}
      />
      {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}

      {/* CPF */}
      <label htmlFor="cpf" className="font-semibold text-roxo-escuro">
        CPF (somente números)
      </label>
      <input
        type="text"
        id="cpf"
        placeholder="11122233344"
        maxLength={11}
        className={`${inputBaseClass} ${
          errors.cpf ? inputErrorClass : inputValidClass
        }`}
        {...register("cpf")}
      />
      {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}

      {/* Data de Nascimento */}
      <label
        htmlFor="dataNascimento"
        className="font-semibold text-roxo-escuro"
      >
        Data de Nascimento
      </label>
      <input
        type="date"
        id="dataNascimento"
        className={`${inputBaseClass} ${
          errors.dataNascimento ? inputErrorClass : inputValidClass
        }`}
        {...register("dataNascimento")}
      />
      {errors.dataNascimento && (
        <p className="text-red-500 text-sm">{errors.dataNascimento.message}</p>
      )}

      {/* Sexo Biológico */}
      <label
        htmlFor="sexoBiologico"
        className="font-semibold text-roxo-escuro"
      >
        Sexo Biológico
      </label>
      <select
        id="sexoBiologico"
        className={`${inputBaseClass} ${
          errors.sexoBiologico ? inputErrorClass : inputValidClass
        }`}
        {...register("sexoBiologico")}
        defaultValue=""
      >
        <option value="" disabled>
          Selecione...
        </option>
        <option value="F">Feminino</option>
        <option value="M">Masculino</option>
      </select>
      {errors.sexoBiologico && (
        <p className="text-red-500 text-sm">{errors.sexoBiologico.message}</p>
      )}

      {/* Escolaridade */}
      <label htmlFor="escolaridade" className="font-semibold text-roxo-escuro">
        Escolaridade
      </label>
      <input
        type="text"
        id="escolaridade"
        placeholder="Ensino Médio Completo"
        className={`${inputBaseClass} ${
          errors.escolaridade ? inputErrorClass : inputValidClass
        }`}
        {...register("escolaridade")}
      />
      {errors.escolaridade && (
        <p className="text-red-500 text-sm">{errors.escolaridade.message}</p>
      )}

      {/* Deficiência (TP_DEFICIENCIA) */}
<label htmlFor="deficiencia" className="font-semibold text-roxo-escuro">
        Tipo de Deficiência
      </label>
      <select
        id="deficiencia"
        className={`${inputBaseClass} ${
          errors.deficiencia ? inputErrorClass : inputValidClass
        }`}
        {...register("deficiencia")}
        defaultValue=""
      >
        <option value="" disabled>
          Selecione...
        </option>
        {/* --- VALORES ATUALIZADOS (Nomes do Enum) --- */}
        <option value="SEM DEF">Nenhuma (Sem Def.)</option>
        <option value="MOTORA">Motora</option>
        <option value="INTELECTUAL">Intelectual</option>
      </select>
      {errors.deficiencia && (
        <p className="text-red-500 text-sm">{errors.deficiencia.message}</p>
      )}

      {/* Acompanhante (DS_ACOMPANHANTE) */}
      <label htmlFor="dsAcompanhante" className="font-semibold text-roxo-escuro">
        Possui Acompanhante?
      </label>
      <select
        id="dsAcompanhante"
        className={`${inputBaseClass} ${
          errors.dsAcompanhante ? inputErrorClass : inputValidClass
        }`}
        {...register("dsAcompanhante")}
        defaultValue=""
      >
        <option value="" disabled>
          Selecione...
        </option>
        <option value="S">Sim</option>
        <option value="N">Não</option>
      </select>
      {errors.dsAcompanhante && (
        <p className="text-red-500 text-sm">{errors.dsAcompanhante.message}</p>
      )}

      {/* Classificação (NR_CLASSIFICACAO) - Opcional */}
      <label
        htmlFor="classificacao"
        className="font-semibold text-roxo-escuro"
      >
        Classificação (1-5, opcional)
      </label>
      <input
        type="number"
        id="classificacao"
        placeholder="Ex: 2"
        min={1}
        max={5}
        className={`${inputBaseClass} ${
          errors.classificacao ? inputErrorClass : inputValidClass
        }`}
        {...register("classificacao", { valueAsNumber: true })}
      />
      {errors.classificacao && (
        <p className="text-red-500 text-sm">{errors.classificacao.message}</p>
      )}

      {/* Porcentagem Falta (NR_PORCENTAGEM_FALTA) - Opcional */}
      <label
        htmlFor="nrPorcentagemFalta"
        className="font-semibold text-roxo-escuro"
      >
        Porcentagem de Falta (0-100, opcional)
      </label>
      <input
        type="number"
        id="nrPorcentagemFalta"
        placeholder="Ex: 33"
        min={0}
        max={100}
        className={`${inputBaseClass} ${
          errors.nrPorcentagemFalta ? inputErrorClass : inputValidClass
        }`}
        {...register("nrPorcentagemFalta", { valueAsNumber: true })}
      />
      {errors.nrPorcentagemFalta && (
        <p className="text-red-500 text-sm">
          {errors.nrPorcentagemFalta.message}
        </p>
      )}

      {/* Botão */}
      <button
        type="submit"
        className="p-3 mt-4 rounded-lg bg-verde-escuro text-quase-branco font-semibold hover:bg-[#00352c] transition-colors"
      >
        Cadastrar Paciente
      </button>
    </form>
  );
}