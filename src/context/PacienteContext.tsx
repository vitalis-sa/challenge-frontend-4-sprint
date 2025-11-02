import { createContext, useCallback, useState, useContext } from "react";
import type { Paciente } from "../types/paciente";
import type { PacienteFormData } from "../schemas/paciente-schema";
import { API_VITALIS } from "../api/vitalis-api";

const API_PACIENTES_ENDPOINT = `${API_VITALIS}/pacientes`;

interface PacienteContextProps {
  pacientes: Paciente[];
  savePaciente: (paciente: PacienteFormData) => Promise<void>;
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

  const savePaciente = useCallback(async (value: PacienteFormData) => {
    await fetch(API_PACIENTES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(value),
    });
    await fetchPacientes();
  }, [fetchPacientes]);

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