import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../index.css";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface FormData {
  nome: string;
  telefone1: string;
  telefone2?: string;
  email: string;
  dataNascimento: string;
}

interface FormErrors {
  nome?: string;
  telefone1?: string;
  email?: string;
  dataNascimento?: string;
}

export function SignUp() {
  const [form, setForm] = useState<FormData>({
    nome: "",
    telefone1: "",
    telefone2: "",
    email: "",
    dataNascimento: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Função para atualizar o form
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Máscara simples de telefone
    if (name === "telefone1" || name === "telefone2") {
      let formatted = value.replace(/\D/g, ""); // remove tudo que não é número
      if (formatted.length > 2) formatted = `(${formatted.slice(0, 2)}) ${formatted.slice(2)}`;
      if (formatted.length > 9) formatted = `${formatted.slice(0, 9)}-${formatted.slice(9, 13)}`;
      setForm(prev => ({ ...prev, [name]: formatted }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!form.nome.trim()) newErrors.nome = "É obrigatório preencher o nome";
    if (!form.telefone1.trim()) newErrors.telefone1 = "Telefone obrigatório";
    if (!form.email.trim()) newErrors.email = "E-mail obrigatório";
    if (!form.dataNascimento.trim()) newErrors.dataNascimento = "Data de nascimento obrigatória";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Dados enviados:", form);
      alert("Cadastro realizado com sucesso!");
      // aqui você poderia enviar para API
    }
  };

  return (
    <>
      <Header />
      <main className="flex justify-center items-center p-12 bg-roxo min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12">

          {/* Imagem */}
          <div className="md:w-[45%] flex justify-center">
            <img
              src="src/assets/contact-us-animate.svg"
              alt="Pessoa usando sistema"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl" />
          </div>

          {/* Formulário */}
          <section className="md:w-[55%] flex flex-col bg-quase-branco rounded-xl p-12 shadow-xl">
            <h2 className="text-center text-roxo-escuro text-3xl md:text-4xl font-bold mb-8">
              Cadastro
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Nome */}
              <label htmlFor="nome" className="font-semibold text-roxo-escuro">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Seu nome"
                value={form.nome}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
          ${errors.nome ? "border-red-500 bg-red-100" : "border-gray-300"}`} />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}

              {/* Telefone 1 */}
              <label htmlFor="telefone1" className="font-semibold text-roxo-escuro">Telefone</label>
              <input
                type="text"
                id="telefone1"
                name="telefone1"
                placeholder="(99) 99999-9999"
                value={form.telefone1}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
          ${errors.telefone1 ? "border-red-500 bg-red-100" : "border-gray-300"}`} />
              {errors.telefone1 && <p className="text-red-500 text-sm">{errors.telefone1}</p>}

              {/* Telefone 2 (opcional) */}
              <label htmlFor="telefone2" className="font-semibold text-roxo-escuro">Segundo telefone (opcional)</label>
              <input
                type="text"
                id="telefone2"
                name="telefone2"
                placeholder="(99) 99999-9999"
                value={form.telefone2}
                onChange={handleChange}
                className="p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal border-gray-300" />

              {/* E-mail */}
              <label htmlFor="email" className="font-semibold text-roxo-escuro">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
          ${errors.email ? "border-red-500 bg-red-100" : "border-gray-300"}`} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              {/* Data de nascimento */}
              <label htmlFor="dataNascimento" className="font-semibold text-roxo-escuro">Data de Nascimento</label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={form.dataNascimento}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
          ${errors.dataNascimento ? "border-red-500 bg-red-100" : "border-gray-300"}`} />
              {errors.dataNascimento && <p className="text-red-500 text-sm">{errors.dataNascimento}</p>}

              {/* Botão */}
              <button
                type="submit"
                className="p-3 mt-4 rounded-lg bg-verde-escuro text-quase-branco font-semibold hover:bg-[#00352c] transition-colors"
              >
                Cadastrar
              </button>
            </form>

            {/* Info de contato */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-roxo-escuro">
              <h3 className="text-lg font-semibold mb-2 text-roxo-escuro">Outros meios de contato</h3>
              <p>Email: contato@atendeplus.com.br</p>
              <p>Telefone: (11) 91234-5678</p>
              <p>Endereço: Av. das Nações, 1234 - São Paulo, SP</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
