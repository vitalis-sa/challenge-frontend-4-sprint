
import { useEffect } from "react";
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
      <Header></Header>
      
      {/* Você pode adicionar um Link para a página de cadastro aqui */}
      {/* Ex: <Link to="/pacientes/novo">Cadastrar Novo Paciente</Link> */}

      <PacienteList pacienteList={pacientes} />
    </>
  );
}