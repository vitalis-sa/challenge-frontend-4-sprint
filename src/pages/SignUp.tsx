// src/pages/CadastroPacientePage.tsx
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { PacienteForm } from "../components/pacienteForm"; // Importa o novo formulário
import "../index.css"; // (Seu css global)

export function SignUp() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center p-12 bg-roxo min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12">
          
          {/* Imagem */}
          <div className="md:w-[45%] flex justify-center">
            <img
              src="/src/assets/contact-us-animate.svg" // (Mantive o path da sua imagem)
              alt="Pessoa usando sistema"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />
          </div>

          {/* Seção do Formulário */}
          <section className="md:w-[55%] flex flex-col bg-quase-branco rounded-xl p-12 shadow-xl">
            <h2 className="text-center text-roxo-escuro text-3xl md:text-4xl font-bold mb-8">
              Cadastro de Paciente
            </h2>

            {/* Renderiza o formulário com a lógica do react-hook-form */}
            <PacienteForm />

            {/* Info de contato (mantido do seu layout) */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-roxo-escuro">
              <h3 className="text-lg font-semibold mb-2 text-roxo-escuro">
                Central de Atendimento
              </h3>
              <p>Em caso de dúvidas, entre em contato:</p>
              <p>Email: contato@atendeplus.com.br</p>
              <p>Telefone: (11) 91234-5678</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}