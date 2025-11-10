/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, useContext } from "react";
import type { Consulta } from "../types/consulta";
import type { ConsultaFormData } from "../schemas/consulta-schema";
import { API_VITALIS } from "../api/vitalis-api";

// Endpoint da API de Consultas (baseado nos nossos chats anteriores)
const API_CONSULTAS_ENDPOINT = `${API_VITALIS}/consultas`;

interface ConsultaContextProps {
  consultas: Consulta[];
  saveConsulta: (consulta: ConsultaFormData) => Promise<void>;
  removeConsulta: (id: number) => Promise<void>;
  fetchConsultas: () => Promise<void>;
}

export const ConsultasContext = createContext<ConsultaContextProps>(
  {} as ConsultaContextProps
);

interface ConsultasProviderProps {
  children: React.ReactNode;
}

export function ConsultasProvider({ children }: ConsultasProviderProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  const fetchConsultas = useCallback(async () => {
    try {
      const response = await fetch(API_CONSULTAS_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Falha ao buscar consultas");
      
      const data = await response.json();
      setConsultas(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const saveConsulta = useCallback(async (value: ConsultaFormData) => {
    await fetch(API_CONSULTAS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      // O 'value' já está no formato que a API espera
      // (idPaciente: number, especialidade: string, dataHora: string)
      body: JSON.stringify(value),
    });
    // Após salvar, idealmente você buscaria as consultas do paciente
    // ou apenas as consultas gerais, se houver uma tela para isso.
    // Por enquanto, vamos apenas logar.
    console.log("Consulta salva!", value);
    // await fetchConsultas(); // Descomente se precisar recarregar a lista
  }, []);

  const removeConsulta = useCallback(async (id: number) => {
    await fetch(`${API_CONSULTAS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    await fetchConsultas();
  }, [fetchConsultas]);

  return (
    <ConsultasContext.Provider
      value={{
        consultas,
        saveConsulta,
        removeConsulta,
        fetchConsultas,
      }}
    >
      {children}
    </ConsultasContext.Provider>
  );
}

export const useConsultas = () => {
  return useContext(ConsultasContext);
};