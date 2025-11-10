import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePacientes } from "../context/PacienteContext";
import {
  pacienteSchema,
  type PacienteFormData,
  type PacienteApiPayload, // Importamos o payload final
} from "../schemas/paciente-schema";
import { useNavigate } from "react-router-dom";

export function PacienteForm() {
  const { savePaciente } = usePacientes();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
  });

  // --- ONSUBMIT ATUALIZADO (LÓGICA DE TRANSFORMAÇÃO) ---
  async function onSubmit(data: PacienteFormData): Promise<void> {
    
    // 1. Quebra os números de telefone
    const telDdd = data.telefoneNumero.substring(0, 2);
    const telNumero = data.telefoneNumero.substring(2);
    const contDdd = data.contatoTelefoneNumero.substring(0, 2);
    const contNumero = data.contatoTelefoneNumero.substring(2);

    // 2. Monta o payload EXATAMENTE como o backend (Java DTO) espera
    const apiPayload: PacienteApiPayload = {
      // Dados do Paciente
      nome: data.nome,
      cpf: data.cpf,
      dataNascimento: data.dataNascimento,
      sexoBiologico: data.sexoBiologico,
      escolaridade: data.escolaridade,
      deficiencia: data.deficiencia,
      dsAcompanhante: data.dsAcompanhante,
      
      // Objeto Telefone
      telefone: {
        ddi: 55, // Hardcoded
        ddd: parseInt(telDdd),
        numero: parseInt(telNumero),
        tipo: data.telefoneTipo,
        status: true // Hardcoded para Ativo
      },
      
      // Objeto Contato
      contato: {
        nomeTipoContato: data.contatoNomeTipo,
        ddi: 55, // Hardcoded
        ddd: parseInt(contDdd),
        numeroTelefone: parseInt(contNumero)
      },

      // Objeto Email
      email: {
        endereco: data.emailEndereco,
        status: "A" // Hardcoded para Ativo
      }
    };
    // ---------------------------------
    
    console.log("Objeto Paciente a ser enviado (API Payload):", apiPayload);
    try {
      // 3. Enviamos o payload transformado
      await savePaciente(apiPayload); 
      
      alert("Paciente cadastrado com sucesso!");
      reset(); 
      navigate("/pacientes"); 
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Erro ao cadastrar paciente. Tente novamente.");
    }
  }

  // Estilos
  const inputBaseClass =
    "p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal";
  const inputErrorClass = "border-red-500 bg-red-100";
  const inputValidClass = "border-gray-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* --- CAMPOS DO PACIENTE --- */}
      {/* Nome */}
      <label htmlFor="nome" className="font-semibold text-roxo-escuro">Nome</label>
      <input
        type="text"
        id="nome"
        placeholder="Nome completo do paciente"
        className={`${inputBaseClass} ${ errors.nome ? inputErrorClass : inputValidClass }`}
        {...register("nome")}
      />
      {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}

      {/* CPF */}
      <label htmlFor="cpf" className="font-semibold text-roxo-escuro">CPF (somente números)</label>
      <input
        type="text"
        id="cpf"
        placeholder="11122233344"
        maxLength={11}
        className={`${inputBaseClass} ${ errors.cpf ? inputErrorClass : inputValidClass }`}
        {...register("cpf")}
      />
      {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
      
      {/* ... (DataNasc, Sexo, Escolaridade, Deficiencia, Acompanhante - IGUAIS) ... */}
      <label htmlFor="dataNascimento" className="font-semibold text-roxo-escuro">Data de Nascimento</label>
      <input
        type="date"
        id="dataNascimento"
        className={`${inputBaseClass} ${ errors.dataNascimento ? inputErrorClass : inputValidClass }`}
        {...register("dataNascimento")}
      />
      {errors.dataNascimento && (<p className="text-red-500 text-sm">{errors.dataNascimento.message}</p>)}

      <label htmlFor="sexoBiologico" className="font-semibold text-roxo-escuro">Sexo Biológico</label>
      <select
        id="sexoBiologico"
        className={`${inputBaseClass} ${ errors.sexoBiologico ? inputErrorClass : inputValidClass }`}
        {...register("sexoBiologico")}
        defaultValue=""
      >
        <option value="" disabled>Selecione...</option>
        <option value="F">Feminino</option>
        <option value="M">Masculino</option>
      </select>
      {errors.sexoBiologico && (<p className="text-red-500 text-sm">{errors.sexoBiologico.message}</p>)}

      <label htmlFor="escolaridade" className="font-semibold text-roxo-escuro">Escolaridade</label>
      <input
        type="text"
        id="escolaridade"
        placeholder="Ensino Médio Completo"
        className={`${inputBaseClass} ${ errors.escolaridade ? inputErrorClass : inputValidClass }`}
        {...register("escolaridade")}
      />
      {errors.escolaridade && (<p className="text-red-500 text-sm">{errors.escolaridade.message}</p>)}

      <label htmlFor="deficiencia" className="font-semibold text-roxo-escuro">Tipo de Deficiência</label>
      <select
        id="deficiencia"
        className={`${inputBaseClass} ${ errors.deficiencia ? inputErrorClass : inputValidClass }`}
        {...register("deficiencia")}
        defaultValue=""
      >
        <option value="" disabled>Selecione...</option>
        <option value="NENHUMA">Nenhuma (Sem Def.)</option>
        <option value="MOTORA">Motora</option>
        <option value="INTELECTUAL">Intelectual</option>
      </select>
      {errors.deficiencia && (<p className="text-red-500 text-sm">{errors.deficiencia.message}</p>)}

      <label htmlFor="dsAcompanhante" className="font-semibold text-roxo-escuro">Possui Acompanhante?</label>
      <select
        id="dsAcompanhante"
        className={`${inputBaseClass} ${ errors.dsAcompanhante ? inputErrorClass : inputValidClass }`}
        {...register("dsAcompanhante")}
        defaultValue=""
      >
        <option value="" disabled>Selecione...</option>
        <option value="S">Sim</option>
        <option value="N">Não</option>
      </select>
      {errors.dsAcompanhante && (<p className="text-red-500 text-sm">{errors.dsAcompanhante.message}</p>)}


      {/* --- SEPARADOR VISUAL --- */}
      <hr className="my-4" />
      <h3 className="text-xl font-semibold text-roxo-escuro -mt-2 mb-2">Informações de Contato</h3>

      {/* --- CAMPOS DE TELEFONE (Já existem) --- */}
      <label htmlFor="telefoneNumero" className="font-semibold text-roxo-escuro">Telefone (DDD + Número)</label>
      <input
        type="tel"
        id="telefoneNumero"
        placeholder="11987654321"
        maxLength={11}
        className={`${inputBaseClass} ${ errors.telefoneNumero ? inputErrorClass : inputValidClass }`}
        {...register("telefoneNumero")}
      />
      {errors.telefoneNumero && (<p className="text-red-500 text-sm">{errors.telefoneNumero.message}</p>)}

      <label htmlFor="telefoneTipo" className="font-semibold text-roxo-escuro">Tipo de Telefone</label>
      <select
        id="telefoneTipo"
        className={`${inputBaseClass} ${ errors.telefoneTipo ? inputErrorClass : inputValidClass }`}
        {...register("telefoneTipo")}
        defaultValue=""
      >
        <option value="" disabled>Selecione...</option>
        <option value="Celular">Celular</option>
        <option value="Residencial">Residencial</option>
        <option value="Comercial">Comercial</option>
      </select>
      {errors.telefoneTipo && (<p className="text-red-500 text-sm">{errors.telefoneTipo.message}</p>)}

      {/* --- NOVOS CAMPOS (EMAIL E CONTATO) --- */}
      
      {/* Email */}
      <label htmlFor="emailEndereco" className="font-semibold text-roxo-escuro">E-mail</label>
      <input
        type="email"
        id="emailEndereco"
        placeholder="paciente@email.com"
        className={`${inputBaseClass} ${ errors.emailEndereco ? inputErrorClass : inputValidClass }`}
        {...register("emailEndereco")}
      />
      {errors.emailEndereco && (<p className="text-red-500 text-sm">{errors.emailEndereco.message}</p>)}
      
      {/* Contato (Tipo) */}
      <label htmlFor="contatoNomeTipo" className="font-semibold text-roxo-escuro">Contato de Emergência (Tipo)</label>
      <input
        type="text"
        id="contatoNomeTipo"
        placeholder="Mãe, Pai, Cuidador(a), etc."
        className={`${inputBaseClass} ${ errors.contatoNomeTipo ? inputErrorClass : inputValidClass }`}
        {...register("contatoNomeTipo")}
      />
      {errors.contatoNomeTipo && (<p className="text-red-500 text-sm">{errors.contatoNomeTipo.message}</p>)}
      
      {/* Contato (Telefone) */}
      <label htmlFor="contatoTelefoneNumero" className="font-semibold text-roxo-escuro">Contato de Emergência (Telefone)</label>
      <input
        type="tel"
        id="contatoTelefoneNumero"
        placeholder="11987654321"
        maxLength={11}
        className={`${inputBaseClass} ${ errors.contatoTelefoneNumero ? inputErrorClass : inputValidClass }`}
        {...register("contatoTelefoneNumero")}
      />
      {errors.contatoTelefoneNumero && (<p className="text-red-500 text-sm">{errors.contatoTelefoneNumero.message}</p>)}

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