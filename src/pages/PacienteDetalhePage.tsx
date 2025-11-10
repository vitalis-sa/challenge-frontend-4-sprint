import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Loading } from "../components/loading";
import { ConsultaCard } from "../components/ConsultaCard";
import { API_VITALIS } from "../api/vitalis-api";
import type { Paciente, Telefone, Contato, Email } from "../types/paciente";
import type { Consulta } from "../types/consulta";

// --- 1. IMPORTS DO FORMULÁRIO ---
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  detalhePacienteSchema,
  type PacienteDetalheFormData,
} from "../schemas/detalhe-paciente-schema";
import {
  type PacienteApiPayload, // DTO que o backend espera
  type TelefoneApiPayload,
  type ContatoApiPayload,
  type EmailApiPayload,
} from "../schemas/paciente-schema"; // Reutiliza os tipos de payload do cadastro
import { ConsultaEditRow } from "../components/ConsultaEditRow"; // O novo componente

// Endpoints
const API_PACIENTES_ENDPOINT = `${API_VITALIS}/pacientes`;
const API_CONSULTAS_ENDPOINT = `${API_VITALIS}/consultas`;

// --- (Funções Helper de Formatação - Inalteradas) ---
function formatarTelefone(tel: Telefone | null | undefined): string {
  if (!tel) return "Não cadastrado";
  const numStr = String(tel.numero);
  const parte1 = numStr.length === 9 ? numStr.substring(0, 5) : numStr.substring(0, 4);
  const parte2 = numStr.length === 9 ? numStr.substring(5) : numStr.substring(4);
  const statusStr = tel.status ? 'Ativo' : 'Inativo';
  return `+${tel.ddi} (${tel.ddd}) ${parte1}-${parte2} [${tel.tipo}] (${statusStr})`;
}
function formatarContato(cont: Contato | null | undefined): string {
  if (!cont) return "Não cadastrado";
  const tipo = cont.tipoContato?.nome || "Tipo N/A"; 
  if (!cont.numeroTelefone) return `${tipo} (sem número)`;
  const numStr = String(cont.numeroTelefone);
  const ddiStr = cont.ddi ? `+${cont.ddi}` : '';
  const dddStr = cont.ddd ? `(${cont.ddd})` : '';
  return `${ddiStr} ${dddStr} ${numStr} [${tipo}]`.trim();
}
function formatarEmail(email: Email | null | undefined): string {
  if (!email) return "Não cadastrado";
  const status = email.status === 'A' ? 'Ativo' : 'Inativo';
  return `${email.endereco} [${status}]`;
}
// --- (Funções de Badge - Inalteradas) ---
const getClassificacaoBadge = (classificacao: number | null) => {
  const value = classificacao || 3; 
  let className = "bg-gray-100 text-gray-800";
  let text = `Neutro (${value})`;
  switch (value) {
    case 1: className = "bg-red-100 text-red-800"; text = `Muito Ruim (${value})`; break;
    case 2: className = "bg-orange-100 text-orange-800"; text = `Ruim (${value})`; break;
    case 3: break;
    case 4: className = "bg-green-100 text-green-800"; text = `Bom (${value})`; break;
    case 5: className = "bg-blue-100 text-blue-800"; text = `Excelente (${value})`; break;
  }
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
      {text}
    </span>
  );
};
const getFaltaBadge = (porcentagem: number | null) => {
  const value = porcentagem || 0;
  let className = "bg-green-100 text-green-800"; 
  let text = `Baixa (${value}%)`;
  if (value > 33 && value <= 66) {
    className = "bg-yellow-100 text-yellow-800";
    text = `Média (${value}%)`;
  } else if (value > 66) {
    className = "bg-red-100 text-red-800";
    text = `Alta (${value}%)`;
  }
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
      {text}
    </span>
  );
};
// --- (Estilos dos Inputs) ---
const inputBaseClass =
  "p-3 rounded-lg border text-base w-full bg-quase-branco focus:outline-none focus:border-azul-principal";
const inputErrorClass = "border-red-500 bg-red-100";
const inputValidClass = "border-gray-300";


// --- INÍCIO DO COMPONENTE ---
export function PacienteDetalhePage() {
  const { id } = useParams<{ id: string }>();

  // Estados de dados (originais)
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // <-- NOSSO NOVO ESTADO
  const [error, setError] = useState<string | null>(null);

  // --- 2. INICIALIZAR REACT-HOOK-FORM ---
  const methods = useForm<PacienteDetalheFormData>({
    resolver: zodResolver(detalhePacienteSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = methods;

  // Para a lista de consultas editáveis
  const { fields: consultaFields } = useFieldArray({
    control,
    name: "consultas",
  });

  // --- 3. FUNÇÃO DE BUSCA DE DADOS (Inalterada) ---
  const fetchData = async () => {
    if (!id) {
      setIsLoading(false);
      setError("ID do paciente não fornecido.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [pacienteResponse, consultasResponse] = await Promise.all([
        fetch(`${API_PACIENTES_ENDPOINT}/${id}`),
        fetch(`${API_PACIENTES_ENDPOINT}/${id}/consultas`),
      ]);
      if (!pacienteResponse.ok) throw new Error("Falha ao buscar dados do paciente.");
      if (!consultasResponse.ok) throw new Error("Falha ao buscar consultas do paciente.");
      const pacienteData: Paciente = await pacienteResponse.json();
      const consultasData: Consulta[] = await consultasResponse.json();
      setPaciente(pacienteData);
      setConsultas(consultasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Dependência: 'id' da URL

  
  // --- 4. FUNÇÕES DE MODO DE EDIÇÃO ---

  // Transforma os dados da API (aninhados) em dados de formulário (planos)
const handleAtivarEdicao = () => {
    if (!paciente) return;
    
    const telNumeroStr = paciente.telefone ? 
      String(paciente.telefone.ddd) + String(paciente.telefone.numero) : "";
      
    const contNumeroStr = paciente.contato ? 
      String(paciente.contato.ddd || '') + String(paciente.contato.numeroTelefone || '') : "";

    const consultasFormatadas = consultas.map(c => ({
      id: c.id,
      dataHora: c.dataHora.substring(0, 16), 
      especialidade: c.especialidade,
      idPaciente: c.paciente.id,
    }));

    // --- CORREÇÃO APLICADA AQUI ---
    // Forçamos a tipagem dos campos que o TS acha que são 'string' genéricos
    // para os tipos de enum específicos que o Zod espera.
    reset({
      nome: paciente.nome,
      cpf: paciente.cpf,
      dataNascimento: paciente.dataNascimento,
      sexoBiologico: paciente.sexoBiologico, // Este já deve estar correto (tipo Genero)
      escolaridade: paciente.escolaridade,
      deficiencia: paciente.deficiencia, // Este já deve estar correto (tipo Deficiencia)
      
      // Corrigido (string -> "S" | "N")
      dsAcompanhante: paciente.dsAcompanhante as "S" | "N", 
      
      telefoneNumero: telNumeroStr,
      // Corrigido (string -> "Celular" | "Residencial" | "Comercial")
      telefoneTipo: (paciente.telefone?.tipo || "Celular") as "Celular" | "Residencial" | "Comercial", 
      telefoneStatus: paciente.telefone?.status || true,

      emailEndereco: paciente.email?.endereco || "",
      emailStatus: (paciente.email?.status as ("A" | "I")) || "A",
      
      contatoNomeTipo: paciente.contato?.tipoContato?.nome || "",
      contatoTelefoneNumero: contNumeroStr,
      contatoDdi: String(paciente.contato?.ddi || ""),
      contatoDdd: String(paciente.contato?.ddd || ""),
      
      consultas: consultasFormatadas,
    });
    // --- FIM DA CORREÇÃO ---
    
    setIsEditing(true); // Ativa o modo de edição
  };

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    reset(); // Limpa o formulário
  };

  // --- 5. FUNÇÃO DE SUBMISSÃO (A MAIS COMPLEXA) ---
  async function onSubmit(data: PacienteDetalheFormData): Promise<void> {
    if (!id) return;
    
    try {
      // --- 5a. Monta o Payload do Paciente (AtualizacaoPacienteDto) ---
      const telDdd = data.telefoneNumero.substring(0, 2);
      const telNumero = data.telefoneNumero.substring(2);
      const contDdd = data.contatoTelefoneNumero.substring(0, 2);
      const contNumero = data.contatoTelefoneNumero.substring(2);

      // Usamos 'any' aqui para poder passar os campos não-editáveis
      const pacientePayload: any = {
        nome: data.nome,
        cpf: data.cpf,
        dataNascimento: data.dataNascimento,
        sexoBiologico: data.sexoBiologico,
        escolaridade: data.escolaridade,
        deficiencia: data.deficiencia,
        dsAcompanhante: data.dsAcompanhante,
        
        // Passa de volta os valores não-editáveis
        classificacao: paciente?.classificacao,
        nrPorcentagemFalta: paciente?.nrPorcentagemFalta,

        telefone: {
          ddi: 55,
          ddd: parseInt(telDdd),
          numero: parseInt(telNumero),
          tipo: data.telefoneTipo,
          status: data.telefoneStatus,
        } as TelefoneApiPayload,

        contato: {
          nomeTipoContato: data.contatoNomeTipo,
          ddi: data.contatoDdi ? parseInt(data.contatoDdi) : 55,
          ddd: parseInt(contDdd),
          numeroTelefone: parseInt(contNumero),
        } as ContatoApiPayload,
        
        email: {
          endereco: data.emailEndereco,
          status: data.emailStatus,
        } as EmailApiPayload,
      };

      // --- 5b. Monta os Payloads das Consultas (AtualizacaoConsultaDto) ---
      const promessasDeUpdate = [];

      // 1. Promessa de Update do Paciente
      promessasDeUpdate.push(
        fetch(`${API_PACIENTES_ENDPOINT}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pacientePayload),
        })
      );

      // 2. Promessas de Update das Consultas
      for (const consulta of data.consultas) {
        // O DTO do backend espera a data com segundos
        const payloadConsulta = {
          dataHora: `${consulta.dataHora}:00`,
          especialidade: consulta.especialidade,
          idPaciente: consulta.idPaciente,
        };
        
        promessasDeUpdate.push(
          fetch(`${API_CONSULTAS_ENDPOINT}/${consulta.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadConsulta),
          })
        );
      }

      // --- 5c. Executa todas as chamadas à API ---
      const responses = await Promise.all(promessasDeUpdate);

      // Verifica se *alguma* falhou
      for (const res of responses) {
        if (!res.ok) {
          throw new Error("Falha ao salvar um dos registros. Verifique os dados.");
        }
      }

      alert("Paciente e consultas atualizados com sucesso!");
      setIsEditing(false);
      fetchData(); // Recarrega os dados

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao salvar");
    }
  }


  // --- 6. RENDERIZAÇÃO (Carregamento, Erro, Paciente não encontrado) ---
  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="p-8 text-center text-red-500">{error}</main>
        <Footer />
      </>
    );
  }

  if (!paciente) {
    return (
      <>
        <Header />
        <main className="p-8 text-center">Paciente não encontrado.</main>
        <Footer />
      </>
    );
  }
  
  const dataNascFormatada = new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });

  return (
    // 7. USA O FORMPROVIDER PARA CONECTAR OS COMPONENTES
    <FormProvider {...methods}>
      <Header />
      {/* 8. O <main> agora é o <form> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          
          {/* Botões de Ação (Editar, Salvar, Cancelar) */}
          <div className="flex justify-end items-center gap-3 mb-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelarEdicao}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-verde-escuro text-white font-semibold hover:bg-[#00352c] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAtivarEdicao}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Editar Paciente
              </button>
            )}
          </div>
          
          {/* --- Seção de Informações (Agora Editável) --- */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold text-roxo-escuro mb-4">
              {/* Campo Nome */}
              {isEditing ? (
                <EditableInput name="nome" error={errors.nome} />
              ) : (
                paciente.nome
              )}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* --- 9. SUBSTITUI InfoItem POR EditableInfoItem --- */}
              
              <EditableInfoItem
                label="CPF"
                name="cpf"
                isEditing={isEditing}
                value={paciente.cpf}
                error={errors.cpf}
              />
              <EditableInfoItem
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                isEditing={isEditing}
                value={dataNascFormatada}
                error={errors.dataNascimento}
              />

              <EditableInfoItem
                label="E-mail"
                name="emailEndereco"
                type="email"
                isEditing={isEditing}
                value={formatarEmail(paciente.email)}
                error={errors.emailEndereco}
              />
              <EditableInfoItem
                label="E-mail Status"
                name="emailStatus"
                isEditing={isEditing}
                value={formatarEmail(paciente.email)} // Mostra formatado
                error={errors.emailStatus}
              >
                {/* O input de 'select' é passado como 'children' */}
                <select
                  id="emailStatus"
                  className={`${inputBaseClass} ${errors.emailStatus ? inputErrorClass : inputValidClass}`}
                  {...register("emailStatus")}
                >
                  <option value="A">Ativo</option>
                  <option value="I">Inativo</option>
                </select>
              </EditableInfoItem>

              <EditableInfoItem
                label="Telefone"
                name="telefoneNumero"
                type="tel"
                maxLength={11}
                isEditing={isEditing}
                value={formatarTelefone(paciente.telefone)}
                error={errors.telefoneNumero}
              />
              <EditableInfoItem
                label="Tipo de Telefone"
                name="telefoneTipo"
                isEditing={isEditing}
                value={formatarTelefone(paciente.telefone)}
                error={errors.telefoneTipo}
              >
                <select
                  id="telefoneTipo"
                  className={`${inputBaseClass} ${errors.telefoneTipo ? inputErrorClass : inputValidClass}`}
                  {...register("telefoneTipo")}
                >
                  <option value="Celular">Celular</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </EditableInfoItem>
              
              <EditableInfoItem
                label="Contato de Emergência"
                name="contatoNomeTipo"
                isEditing={isEditing}
                value={formatarContato(paciente.contato)}
                error={errors.contatoNomeTipo}
              />
              <EditableInfoItem
                label="Telefone do Contato"
                name="contatoTelefoneNumero"
                type="tel"
                maxLength={11}
                isEditing={isEditing}
                value={formatarContato(paciente.contato)}
                error={errors.contatoTelefoneNumero}
              />
              
              <EditableInfoItem
                label="Gênero"
                name="sexoBiologico"
                isEditing={isEditing}
                value={paciente.sexoBiologico === 'F' ? 'Feminino' : 'Masculino'}
                error={errors.sexoBiologico}
              >
                <select
                  id="sexoBiologico"
                  className={`${inputBaseClass} ${errors.sexoBiologico ? inputErrorClass : inputValidClass}`}
                  {...register("sexoBiologico")}
                >
                  <option value="F">Feminino</option>
                  <option value="M">Masculino</option>
                </select>
              </EditableInfoItem>

              <EditableInfoItem
                label="Escolaridade"
                name="escolaridade"
                isEditing={isEditing}
                value={paciente.escolaridade}
                error={errors.escolaridade}
              />
              <EditableInfoItem
                label="Deficiência"
                name="deficiencia"
                isEditing={isEditing}
                value={paciente.deficiencia}
                error={errors.deficiencia}
              >
                <select
                  id="deficiencia"
                  className={`${inputBaseClass} ${errors.deficiencia ? inputErrorClass : inputValidClass}`}
                  {...register("deficiencia")}
                >
                  <option value="NENHUMA">Nenhuma (Sem Def.)</option>
                  <option value="MOTORA">Motora</option>
                  <option value="INTELECTUAL">Intelectual</option>
                </select>
              </EditableInfoItem>
              
              <EditableInfoItem
                label="Tem acompanhante?"
                name="dsAcompanhante"
                isEditing={isEditing}
                value={paciente.dsAcompanhante === 'S' ? 'Sim' : 'Não'}
                error={errors.dsAcompanhante}
              >
                <select
                  id="dsAcompanhante"
                  className={`${inputBaseClass} ${errors.dsAcompanhante ? inputErrorClass : inputValidClass}`}
                  {...register("dsAcompanhante")}
                >
                  <option value="S">Sim</option>
                  <option value="N">Não</option>
                </select>
              </EditableInfoItem>

              {/* Campos Não-Editáveis */}
              <InfoItem 
                label="Classificação" 
                value={getClassificacaoBadge(paciente.classificacao)} 
              />
              <InfoItem 
                label="Probabilidade de falta" 
                value={getFaltaBadge(paciente.nrPorcentagemFalta)} 
              />
            </div>
          </section>
        </main>
      </form>
      
      {/* --- Seção de Consultas (Agora Editável) --- */}
      <section className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-roxo-escuro">
            Histórico de Consultas
          </h2>
          {!isEditing && (
            <Link
              to="/consultas/cadastro"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quase-branco text-verde-escuro font-semibold hover:bg-gray-200 transition-colors shadow-md border border-gray-300"
            >
              <span className="text-xl font-bold">+</span>
              Agendar Nova Consulta
            </Link>
          )}
        </div>

        {/* 10. RENDERIZAÇÃO CONDICIONAL DA LISTA DE CONSULTAS */}
        {isEditing ? (
          // Modo Edição: Renderiza as linhas editáveis
          <div className="flex flex-col gap-4">
            {consultaFields.map((field, index) => (
              <ConsultaEditRow key={field.id} index={index} />
            ))}
          </div>
        ) : (
          // Modo Visualização: Renderiza os cards normais
          consultas.length > 0 ? (
            <div className="flex flex-col gap-4">
              {consultas.map((consulta) => (
                <ConsultaCard key={consulta.id} consulta={consulta} />
              ))}
            </div>
          ) : (
            <p className="bg-white p-6 rounded-lg shadow-md text-gray-500">
              Nenhuma consulta encontrada para este paciente.
            </p>
          )
        )}
      </section>

      <Footer />
    </FormProvider>
  );
}

// --- 11. NOVO COMPONENTE HELPER: EditableInput ---
// (Um input genérico para o formulário)

interface EditableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: { message?: string };
}

function EditableInput({ name, error, ...rest }: EditableInputProps) {
  const { register } = useFormContext();
  return (
    <>
      <input
        id={name}
        className={`${inputBaseClass} ${error ? inputErrorClass : inputValidClass}`}
        {...register(name)}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </>
  );
}

// --- 12. NOVO COMPONENTE HELPER: EditableInfoItem ---
// (Alterna entre o <InfoItem> e um input editável)

interface EditableInfoItemProps {
  label: string;
  name: string; // O nome do campo no react-hook-form
  value: React.ReactNode; // O valor a ser exibido no modo visualização
  isEditing: boolean;
  error?: { message?: string };
  children?: React.ReactNode; // Para passar um <select> customizado
  type?: string;
  maxLength?: number;
}

function EditableInfoItem({ 
  label, 
  name, 
  value, 
  isEditing, 
  error, 
  children, 
  type = "text", 
  maxLength 
}: EditableInfoItemProps) {
  
  const { register } = useFormContext();
  
  const renderInput = () => {
    // Se 'children' (ex: um <select>) for fornecido, use-o
    if (children) {
      return (
        <div className="w-full">
          {children}
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      );
    }
    // Caso contrário, use um <input> padrão
    return (
      <div className="w-full">
        <input
          id={name}
          type={type}
          maxLength={maxLength}
          className={`${inputBaseClass} ${error ? inputErrorClass : inputValidClass}`}
          {...register(name)}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  };

  return (
    <div className="py-3 border-b border-gray-200">
      <label htmlFor={name} className="font-semibold text-gray-600 block mb-2">
        {label}
      </label>
      {isEditing ? (
        renderInput()
      ) : (
        <span className="text-gray-800 text-right w-full block">{value}</span>
      )}
    </div>
  );
}

// --- InfoItem (Seu componente original, usado para campos não-editáveis) ---
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-gray-200 flex justify-between items-center">
      <span className="font-semibold text-gray-600">{label}: </span>
      <span className="text-gray-800 text-right">{value}</span>
    </div>
  );
}