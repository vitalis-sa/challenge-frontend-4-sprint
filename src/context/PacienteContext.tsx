/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, useContext } from "react";
import type { Paciente } from "../types/paciente";
// Importamos o novo tipo que a API espera
import type { PacienteApiPayload } from "../schemas/paciente-schema"; 
import { API_VITALIS } from "../api/vitalis-api";

const API_PACIENTES_ENDPOINT = `${API_VITALIS}/pacientes`;

interface PacienteContextProps {
  pacientes: Paciente[];
  // --- ATUALIZADO ---
  // A função agora espera o payload final da API
  savePaciente: (paciente: PacienteApiPayload) => Promise<void>;
  // ------------------
  removePaciente: (id: number) => Promise<void>;
  fetchPacientes: () => Promise<void>;
}

export const PacientesContext = createContext<PacienteContextProps>(
  {} as PacienteContextProps
);

interface PacientesProviderProps {
  children: React.ReactNode;
}

export function PacientesProvider({ children }: PacientesProviderProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await fetch(API_PACIENTES_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Falha ao buscar pacientes");
      
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // --- ATUALIZADO ---
  // O 'value' que chega aqui agora é o PacienteApiPayload (já formatado)
  const savePaciente = useCallback(async (value: PacienteApiPayload) => {
    const response = await fetch(API_PACIENTES_ENDPOINT, { // <-- Adicionado 'response'
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(value),
    });

    // Adicionada verificação de erro (boa prática)
    if (!response.ok) {
      throw new Error("Falha ao salvar paciente");
    }

    await fetchPacientes();
  }, [fetchPacientes]);
  // ------------------

  const removePaciente = useCallback(async (id: number) => {
    await fetch(`${API_PACIENTES_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    await fetchPacientes();
  }, [fetchPacientes]);

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        savePaciente,
        removePaciente,
        fetchPacientes,
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
}

export const usePacientes = () => {
  return useContext(PacientesContext);
};