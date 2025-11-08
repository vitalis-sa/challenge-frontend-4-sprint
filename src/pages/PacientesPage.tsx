import { useEffect, useState } from "react"; // 1. Importar o useState
import { Link } from "react-router-dom";
import { Header } from "../components/header";
import { PacienteList } from "../components/PacienteList";
import { usePacientes } from "../context/PacienteContext";

// Define quantos pacientes carregar por vez
const PACIENTES_POR_PAGINA = 8;

export function PacientesPage() {
  const { pacientes, fetchPacientes } = usePacientes();
  
  // 2. Estado para controlar quantos pacientes estão visíveis
  const [visibleCount, setVisibleCount] = useState(PACIENTES_POR_PAGINA);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  // 3. Função para mostrar mais pacientes
  const handleCarregarMais = () => {
    setVisibleCount((prevCount) => prevCount + PACIENTES_POR_PAGINA);
  };

  // 4. Criar a lista de pacientes que será realmente exibida
  const pacientesVisiveis = pacientes.slice(0, visibleCount);
  const totalPacientes = pacientes.length;

  return (
    <>
      <Header />
      
      {/* Container principal com padding melhorado */}
      <main className="max-w-6xl mx-auto p-4 md:p-8"> {/* <-- ALTERADO: max-w-6xl para acomodar melhor a grade */}
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-verde-escuro">
            Pacientes Cadastrados
          </h1>
          
          <Link
            to="/cadastrar"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-quase-branco text-verde-escuro font-semibold hover:bg-gray-200 transition-colors shadow-md border border-gray-300 w-full md:w-auto"
          >
            <span className="text-2xl font-bold leading-none">+</span>
            Cadastrar Novo Paciente
          </Link>
        </div>
        
        {/* 5. Passa a lista JÁ FILTRADA para o componente */}
        <PacienteList pacienteList={pacientesVisiveis} />

        {/* 6. Botão de "Carregar Mais" */}
        {totalPacientes > visibleCount && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleCarregarMais}
              className="px-8 py-3 rounded-lg bg-verde-escuro text-white font-semibold hover:bg-opacity-90 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-verde-escuro focus:ring-opacity-50"
            >
              Carregar Mais Pacientes
            </button>
          </div>
        )}
      </main>
    </>
  );
}