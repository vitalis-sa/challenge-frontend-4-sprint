import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../index.css";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface ContactFormData {
  nome: string;
  telefone?: string;
  email: string;
  assunto: string;
  mensagem: string;
}

interface FormErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  assunto?: string;
  mensagem?: string;
}

export function Contato() {
  const [form, setForm] = useState<ContactFormData>({
    nome: "",
    telefone: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Máscara simples de telefone
    if (name === "telefone") {
      let formatted = value.replace(/\D/g, "");
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
    if (!form.email.trim()) newErrors.email = "E-mail obrigatório";
    if (!form.assunto.trim()) newErrors.assunto = "Assunto obrigatório";
    if (!form.mensagem.trim()) newErrors.mensagem = "Mensagem obrigatória";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Mensagem enviada:", form);
      alert("Sua mensagem foi enviada com sucesso!");
      // Aqui você poderia enviar para a API
    }
  };

  return (
    <>
      <Header />
      <main className="flex justify-center items-center p-12 bg-bg-clarinho min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12">

          {/* Imagem */}
          <div className="md:w-[45%] flex justify-center">
            <img
              src="src/assets/contact-us-animate.svg"
              alt="Pessoa enviando mensagem"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />
          </div>

          {/* Formulário de Contato */}
          <section className="md:w-[55%] flex flex-col bg-quase-branco rounded-xl p-12 shadow-xl">
            <h2 className="text-center text-roxo-escuro text-3xl md:text-4xl font-bold mb-8">
              Fale Conosco
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Nome */}
              <label htmlFor="nome" className="font-semibold text-roxo-escuro">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
                ${errors.nome ? "border-red-500 bg-red-100" : "border-gray-300"}`}
              />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}

              {/* Telefone */}
              <label htmlFor="telefone" className="font-semibold text-roxo-escuro">Telefone (opcional)</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                placeholder="(99) 99999-9999"
                value={form.telefone}
                onChange={handleChange}
                className="p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal border-gray-300"
              />

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
                ${errors.email ? "border-red-500 bg-red-100" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              {/* Assunto */}
              <label htmlFor="assunto" className="font-semibold text-roxo-escuro">Assunto</label>
              <input
                type="text"
                id="assunto"
                name="assunto"
                placeholder="Digite o assunto da mensagem"
                value={form.assunto}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
                ${errors.assunto ? "border-red-500 bg-red-100" : "border-gray-300"}`}
              />
              {errors.assunto && <p className="text-red-500 text-sm">{errors.assunto}</p>}

              {/* Mensagem */}
              <label htmlFor="mensagem" className="font-semibold text-roxo-escuro">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                placeholder="Escreva sua mensagem aqui"
                value={form.mensagem}
                onChange={handleChange}
                rows={5}
                className={`p-3 rounded-lg border text-base bg-quase-branco focus:outline-none focus:border-azul-principal
                ${errors.mensagem ? "border-red-500 bg-red-100" : "border-gray-300"}`}
              />
              {errors.mensagem && <p className="text-red-500 text-sm">{errors.mensagem}</p>}

              {/* Botão */}
              <button
                type="submit"
                className="p-3 mt-4 rounded-lg bg-verde-escuro text-quase-branco font-semibold hover:bg-[#00352c] transition-colors"
              >
                Enviar Mensagem
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