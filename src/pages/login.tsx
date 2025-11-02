import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../index.css";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  senha: string;
}

interface LoginErrors {
  email?: string;
  senha?: string;
}

export function Login() {
  const [form, setForm] = useState<LoginData>({ email: "", senha: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate(); // hook para navegação programática

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: LoginErrors = {};

    if (!form.email.trim()) newErrors.email = "E-mail obrigatório";
    if (!form.senha.trim()) newErrors.senha = "Senha obrigatória";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Login realizado:", form);
      navigate("/teste"); // redireciona para a página /teste
    }
  };

  return (
    <>
      <Header />
      <main className="flex justify-center items-center p-12 bg-bg-clarinho min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12">

          {/* Formulário à esquerda */}
          <section className="md:w-[45%] flex flex-col bg-quase-branco rounded-xl p-12 shadow-xl">
            <h2 className="text-center text-roxo-escuro text-3xl md:text-4xl font-bold mb-8">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* E-mail */}
              <label htmlFor="email" className="font-semibold text-texto-escuro">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-black
                ${errors.email ? "border-red-500 bg-red-100" : "border-gray-300"}`} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              {/* Senha */}
              <label htmlFor="senha" className="font-semibold text-texto-escuro">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-black
                ${errors.senha ? "border-red-500 bg-red-100" : "border-gray-300"}`} />
              {errors.senha && <p className="text-red-500 text-sm">{errors.senha}</p>}

              {/* Botão */}
              <button
                type="submit"
                className="p-3 mt-4 rounded-lg bg-verde-escuro text-white font-semibold hover:bg-[#00352c] transition-colors"
              >
                Entrar
              </button>
            </form>
          </section>

          {/* Imagem à direita */}
          <div className="md:w-[55%] flex justify-center">
            <img
              src="src/assets/login-animate.svg"
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
