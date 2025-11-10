import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../index.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";
import { useAuth } from "../context/AuthContext"; // <-- Importa o hook de Auth
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import loginImage from "../assets/login-animate.svg";

export function Login() {
  const { login } = useAuth(); // <-- Pega a função de login
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // <-- Pega 'isSubmitting' para feedback
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setLoginError(null); // Limpa erros antigos
    try {
      await login(data.cpf); // Chama o login do contexto
      navigate("/teste"); // Redireciona para /teste em caso de sucesso
    } catch (error) {
      console.error(error);
      setLoginError("CPF não encontrado. Verifique os dados e tente novamente.");
    }
  }

  return (
    <>
      <Header />
      <main className="flex justify-center items-center p-12 bg-bg-clarinho min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12">
          {/* Formulário à esquerda */}
          <section className="md:w-[45%] flex flex-col bg-quase-branco rounded-xl p-12 shadow-xl">
            <h2 className="text-center text-roxo-escuro text-3xl md:text-4xl font-bold mb-8">
              Login do Paciente
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* CPF */}
              <label htmlFor="cpf" className="font-semibold text-texto-escuro">
                CPF (apenas números)
              </label>
              <input
                type="text"
                id="cpf"
                placeholder="Digite os 11 dígitos do seu CPF"
                maxLength={11}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-black
                ${errors.cpf ? "border-red-500 bg-red-100" : "border-gray-300"}`}
                {...register("cpf")}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm">{errors.cpf.message}</p>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={isSubmitting} // Desabilita o botão durante o login
                className="p-3 mt-4 rounded-lg bg-verde-escuro text-white font-semibold hover:bg-[#00352c] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>

              {/* Exibe erro de login (401) */}
              {loginError && (
                <p className="text-red-500 text-sm text-center mt-2">{loginError}</p>
              )}
            </form>
          </section>

          {/* Imagem à direita */}
          <div className="md:w-[55%] flex justify-center">
            <img
              src={loginImage}
              alt="Pessoa fazendo login"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}