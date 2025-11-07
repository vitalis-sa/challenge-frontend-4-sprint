/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, useContext, useEffect } from "react";
import type { Paciente } from "../types/paciente"; // Importe seu tipo Paciente
import { API_VITALIS } from "../api/vitalis-api";

// O DTO que o backend espera
interface LoginRequest {
  cpf: string;
}

// O que o Contexto irá fornecer
interface AuthContextProps {
  user: Paciente | null; // O usuário logado será um Paciente
  login: (cpf: string) => Promise<void>; // Função de login
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const API_LOGIN_ENDPOINT = `${API_VITALIS}/login`;
const USER_STORAGE_KEY = "vitalis:user"; // Chave para o localStorage

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Paciente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o usuário do localStorage ao iniciar a aplicação
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Falha ao carregar usuário do localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (cpf: string) => {
    const loginRequest: LoginRequest = { cpf };

    const response = await fetch(API_LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      // Se a resposta for 401 (UNAUTHORIZED) ou outro erro
      throw new Error("CPF não encontrado ou inválido.");
    }

    const data: Paciente = await response.json();

    setUser(data);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};