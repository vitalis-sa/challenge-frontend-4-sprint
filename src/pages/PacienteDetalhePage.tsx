import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // 1. Importar o Link
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Loading } from "../components/loading";
import { ConsultaCard } from "../components/ConsultaCard";
import { API_VITALIS } from "../api/vitalis-api";
import type { Paciente } from "../types/paciente";
import type { Consulta } from "../types/consulta";

// Endpoints da API
const API_PACIENTES_ENDPOINT = `${API_VITALIS}/pacientes`;

export function PacienteDetalhePage() {
  // 1. Pega o 'id' da URL (ex: /pacientes/1)
  const { id } = useParams<{ id: string }>();

  // 2. Estados para guardar os dados
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Busca os dados da API quando o 'id' mudar
  useEffect(() => {
    // Evita buscas se o ID não estiver presente
    if (!id) {
      setIsLoading(false);
      setError("ID do paciente não fornecido.");
      return;
    }

    // Função para buscar os dados
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // 4. Faz as duas chamadas à API em paralelo
        const [pacienteResponse, consultasResponse] = await Promise.all([
          fetch(`${API_PACIENTES_ENDPOINT}/${id}`),
          fetch(`${API_PACIENTES_ENDPOINT}/${id}/consultas`),
        ]);

        if (!pacienteResponse.ok) {
          throw new Error("Falha ao buscar dados do paciente.");
        }
        if (!consultasResponse.ok) {
          throw new Error("Falha ao buscar consultas do paciente.");
        }

        const pacienteData: Paciente = await pacienteResponse.json();
        const consultasData: Consulta[] = await consultasResponse.json();

        setPaciente(pacienteData);
        setConsultas(consultasData);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]); // Dependência: 'id' da URL

  // --- Renderização ---

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

  // Formata a data para exibição (ex: 20/10/1985)
  const dataNascFormatada = new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });

  // --- NOVA FUNÇÃO 1: Lógica para a badge de Classificação ---
  const getClassificacaoBadge = (classificacao: number | null) => {
    // Assume 3 (Neutro) se for nulo, como no seu backend
    const value = classificacao || 3; 
    let className = "bg-gray-100 text-gray-800";
    let text = `Neutro (${value})`;

    switch (value) {
      case 1:
        className = "bg-red-100 text-red-800";
        text = `Muito Ruim (${value})`;
        break;
      case 2:
        className = "bg-orange-100 text-orange-800";
        text = `Ruim (${value})`;
        break;
      case 3:
        // A classe/texto padrão já é "Neutro (3)"
        break;
      case 4:
        className = "bg-green-100 text-green-800";
        text = `Bom (${value})`;
        break;
      case 5:
        className = "bg-blue-100 text-blue-800";
        text = `Excelente (${value})`;
        break;
    }

    // Retorna o JSX da badge
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
        {text}
      </span>
    );
  };

  // --- NOVA FUNÇÃO 2: Lógica para a badge de Probabilidade de Falta ---
  const getFaltaBadge = (porcentagem: number | null) => {
    const value = porcentagem || 0;
    let className = "bg-green-100 text-green-800"; // Baixo (Bom)
    let text = `Baixa (${value}%)`;

    if (value > 33 && value <= 66) {
      className = "bg-yellow-100 text-yellow-800"; // Média (Atenção)
      text = `Média (${value}%)`;
    } else if (value > 66) {
      className = "bg-red-100 text-red-800"; // Alta (Ruim)
      text = `Alta (${value}%)`;
    }

    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
        {text}
      </span>
    );
  };


  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* --- Card de Informações do Paciente --- */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold text-roxo-escuro mb-4">{paciente.nome}</h1>
          
          {/* --- GRID DE INFORMAÇÕES ATUALIZADA --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <InfoItem label="CPF" value={paciente.cpf} />
            <InfoItem label="Data de Nascimento" value={dataNascFormatada} />
            <InfoItem label="Gênero" value={paciente.genero === 'F' ? 'Feminino' : 'Masculino'} />
            <InfoItem label="Escolaridade" value={paciente.escolaridade} />
            <InfoItem label="Deficiência" value={paciente.deficiencia} />
            <InfoItem label="Tem acompanhante?" value={paciente.dsAcompanhante === 'S' ? 'Sim' : 'Não'} />

            {/* --- ITENS ATUALIZADOS COM AS BADGES --- */}
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

        {/* --- Seção de Consultas --- */}
        <section>
          
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-roxo-escuro">
              Histórico de Consultas
            </h2>
            
            <Link
              to="/consultas/cadastro"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quase-branco text-verde-escuro font-semibold hover:bg-gray-200 transition-colors shadow-md border border-gray-300"
            >
              <span className="text-xl font-bold">+</span>
              Agendar Nova Consulta
            </Link>
          </div>

          {/* O restante da seção de consultas */}
          {consultas.length > 0 ? (
            <div className="flex flex-col gap-4">
              {consultas.map((consulta) => (
                <ConsultaCard key={consulta.id} consulta={consulta} />
              ))}
            </div>
          ) : (
            <p className="bg-white p-6 rounded-lg shadow-md text-gray-500">
              Nenhuma consulta encontrada para este paciente.
            </p>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}

// --- COMPONENTE HELPER ATUALIZADO ---
// Agora 'value' aceita React.ReactNode (qualquer elemento JSX)
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    // Usa flex para alinhar o label à esquerda e a badge à direita
    <div className="py-3 border-b border-gray-200 flex justify-between items-center">
      <span className="font-semibold text-gray-600">{label}: </span>
      {/* O 'value' agora pode ser um <span>, <p> ou a nossa badge colorida */}
      {value}
    </div>
  );
}