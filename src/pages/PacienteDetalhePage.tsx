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

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* --- Card de Informações do Paciente --- */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold text-roxo-escuro mb-4">{paciente.nome}</h1>
          {/* O (grid) com as infos do paciente continua aqui */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
           <InfoItem label="CPF" value={paciente.cpf} />
            <InfoItem label="Data de Nascimento" value={dataNascFormatada} />
            <InfoItem label="Gênero" value={paciente.genero === 'F' ? 'Feminino' : 'Masculino'} />
            <InfoItem label="Escolaridade" value={paciente.escolaridade} />
            <InfoItem label="Deficiência" value={paciente.deficiencia} />
            <InfoItem label="Classificação" value={paciente.classificacao || 'N/A'} />
            <InfoItem label="Tem acompanhante?" value={paciente.dsAcompanhante || 'N/A'} />
            <InfoItem label="Probabilidade de falta (%)" value={paciente.nrPorcentagemFalta || 'N/A'} />
          </div>
        </section>

        {/* --- Seção de Consultas --- */}
        <section>
          
          {/* 2. ADICIONADO: Flex container para o Título e o Botão */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-roxo-escuro">
              Histórico de Consultas
            </h2>
            
            {/* 3. ADICIONADO: O botão/link */}
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

// Componente helper para os itens de informação
function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">{label}: </span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}