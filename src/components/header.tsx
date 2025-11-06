import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import atende_mais from "../assets/atende+.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation(); 

  // 1. Defina quais são os links públicos (do Paciente)
  const linksPaciente = [
    { to: "/", label: "Home" },
    { to: "/about", label: "Sobre" },
    { to: "/integrantes", label: "Integrantes" },
    { to: "/faq", label: "FAQ" },
    { to: "/teste", label: "Teste" },
    { to: "/contato", label: "Contato" }
  ];

  // 2. Defina quais são os links da área do Médico
  // (Baseado nas rotas que você criou no App.tsx)
  const linksMedico = [
    { to: "/pacientes", label: "Pacientes" }, // A lista de pacientes
    { to: "/cadastrar", label: "Cadastrar Paciente" }, // Rota do SignUp
    { to: "/consultas/cadastro", label: "Agendar Consulta" },
  ];

  // 3. Verifique se estamos na área do Médico
  // Se a URL começar com qualquer uma dessas, é a área do médico.
  const rotasMedico = ["/pacientes", "/cadastrar", "/consultas"];
  const isAreaMedico = rotasMedico.some((rota) => 
    location.pathname.startsWith(rota)
  );

  // 4. Decida qual conjunto de links usar
  const links = isAreaMedico ? linksMedico : linksPaciente;

  // 5. Função para fechar o menu mobile ao clicar em um link
  const handleLinkClick = () => {
    setOpen(false);
  };

  // --- FIM DA LÓGICA ---

  return (
    <nav className="bg-roxo-escuro shadow w-full h-[80px] flex items-center px-5 md:px-8">
      {/* Logo (sempre leva para a Home) */}
      <Link 
        to="/" 
        className="flex items-center gap-2 text-amarelo-claro hover:opacity-80"
        onClick={handleLinkClick} // Fecha o menu se estiver aberto
      >
        <img src={atende_mais} alt="Logo do projeto" className="max-w-[110px] h-auto" />
      </Link>

      {/* Menu desktop */}
      <div className="hidden md:flex gap-6 ml-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium text-base text-amarelo-claro hover:opacity-80 ${
                isActive ? "border-b border-rosa-claro text-rosa-claro" : ""
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Botão mobile */}
      <button
        className="md:hidden text-amarelo-claro ml-auto"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Menu mobile */}
      {open && (
        <div className="absolute top-[80px] left-0 w-full bg-roxo-escuro flex flex-col items-center gap-4 py-4 md:hidden">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick} // Adicionado aqui também
                className={`font-medium text-lg text-amarelo-claro hover:opacity-80 ${
                  isActive ? "border-b border-rosa-claro text-rosa-claro" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}