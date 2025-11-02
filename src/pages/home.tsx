import hospitalImg from "../assets/hospital-family-visit-animate.svg";
import { Link } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function Home() {
  return (
    <>
      <Header/>
      <main>
        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-around min-h-[80vh] bg-[#f7f8fa] px-4 md:px-30 py-12">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h2 className="font-extrabold text-4xl md:text-6xl text-[#551c41] mb-6">
              Bem-vindo ao Atende+
            </h2>
            <p className="text-lg md:text-xl text-[#2d2d2d] mb-8 max-w-xl">
              Uma solução moderna que utiliza inteligência artificial e testes
              interativos para garantir que você tenha uma experiência de
              atendimento simples, segura e eficiente.
            </p>
            <Link
              to="/teste"
              className="bg-[#0b3d2e] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-[#145c43] transition"
            >
              Faça seus testes agora
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
            <img
              src={hospitalImg}
              alt="Hospital moderno"
              className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl h-auto"
            />
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}