import { useEffect } from "react";
import { Link } from "react-router-dom"; // 1. Importar o Link
import { Header } from "../components/header"; // Reutilizando seu Header
import { PacienteList } from "../components/PacienteList";
import { usePacientes } from "../context/PacienteContext";

export function PacientesPage() {
  const { pacientes, fetchPacientes } = usePacientes();

  // Busca os pacientes quando o componente é montado
  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]); // O array de dependência garante que isso rode só uma vez

  return (
    <>
      <Header />
      
      {/* 2. Container principal para layout */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* 3. Botão de Cadastro (Centralizado e Estilizado) */}
        <div className="flex justify-center mb-6"> {/* <-- ALTERADO */}
          <Link
            to="/cadastrar" // Rota para a página SignUp
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-quase-branco text-verde-escuro font-semibold hover:bg-gray-200 transition-colors shadow-md border border-gray-300" // <-- ALTERADO
          >
            {/* 4. Símbolo de + Adicionado */}
            <span className="text-xl font-bold">+</span> 
            Cadastrar Novo Paciente
          </Link>
        </div>
        
        {/* 5. Lista de Pacientes */}
        <PacienteList pacienteList={pacientes} />
      </main>
    </>
  );
}