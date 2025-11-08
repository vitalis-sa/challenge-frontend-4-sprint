import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { ConsultaForm } from "../components/ConsultaForm"; // Importa o novo formulário
import "../index.css"; 
import contactUs from "../assets/contact-us-animate.svg";

export function CadastroConsultaPage() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center p-12 bg-roxo min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12">
          
          {/* Imagem (reutilizei a mesma) */}
          <div className="md:w-[45%] flex justify-center">
            <img
              src={contactUs}
              alt="Pessoa usando sistema"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />
          </div>

          {/* Seção do Formulário */}
          <section className="md:w-[55%] flex flex-col bg-quase-branco rounded-xl p-12 shadow-xl">
            <h2 className="text-center text-roxo-escuro text-3xl md:text-4xl font-bold mb-8">
              Agendamento de Consulta
            </h2>

            {/* Renderiza o formulário de consulta */}
            <ConsultaForm />

          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}