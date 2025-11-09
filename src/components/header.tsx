import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import atende_mais from "../assets/atende+.png";
import { useAuth } from "../context/AuthContext"; // 1. Importar o Auth

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate(); // 2. Importar o Navigate

  // 3. Pegar o usuário e a função de logout do Contexto
  const { user, logout } = useAuth();

  const links = [
    // Links Públicos/Paciente
    { to: "/", label: "Home" },
    { to: "/about", label: "Sobre" },
    { to: "/integrantes", label: "Integrantes" },
    { to: "/faq", label: "FAQ" },
    { to: "/contato", label: "Contato" },
    { to: "/teste", label: "Teste" }, // Link do Paciente
    
    // Links do Médico
    { to: "/pacientes", label: "Pacientes" }, 
    { to: "/cadastrar", label: "Cadastrar Paciente" }, 
    { to: "/consultas/cadastro", label: "Agendar Consulta" },
  ];

  // 5. Função para fechar o menu mobile ao clicar
  const handleLinkClick = () => {
    setOpen(false);
  };

  // 6. Função de Logout
  const handleLogout = () => {
    logout(); // Limpa o contexto e localStorage
    handleLinkClick(); // Fecha o menu mobile
    navigate("/"); // Redireciona para a Home
  };

  return (
    <nav className="bg-roxo-escuro shadow w-full h-[80px] flex items-center px-5 md:px-8">
      {/* Logo (sempre leva para a Home) */}
      <Link 
        to="/" 
        className="flex items-center gap-2 text-amarelo-claro hover:opacity-80"
        onClick={handleLinkClick} 
      >
        <img src={atende_mais} alt="Logo do projeto" className="max-w-[110px] h-auto" />
      </Link>

      {/* --- MENU DESKTOP ATUALIZADO --- */}
      <div className="hidden md:flex gap-6 ml-auto items-center">
        {/* Links Dinâmicos (agora mostra todos) */}
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

        {/* --- Lógica de Botão Login/Logout (Sempre visível) --- */}
        <div className="pl-4">
          {user ? (
            // Se ESTÁ logado
            <div className="flex items-center gap-3">
              <span className="text-amarelo-claro text-sm font-medium">
                Olá, {user.nome.split(' ')[0]}!
              </span>
              <button
                onClick={handleLogout}
                className="font-medium text-base bg-rosa-claro text-roxo-escuro px-3 py-1 rounded hover:opacity-80 transition-opacity"
              >
                Sair
              </button>
            </div>
          ) : (
            // Se NÃO está logado
            <Link
              to="/login"
              className="font-medium text-base bg-amarelo-claro text-roxo-escuro px-3 py-1 rounded hover:opacity-80 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>
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
            d={
              open
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* --- MENU MOBILE ATUALIZADO --- */}
      {open && (
        <div className="absolute top-[80px] left-0 w-full bg-roxo-escuro flex flex-col items-center gap-4 py-4 md:hidden z-50">
          {/* Links Dinâmicos */}
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick} // Fecha o menu
                className={`font-medium text-lg text-amarelo-claro hover:opacity-80 ${
                  isActive ? "border-b border-rosa-claro text-rosa-claro" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* --- Lógica de Botão Login/Logout (Mobile) --- */}
          <div className="mt-4 pt-4 border-t border-gray-700 w-full flex flex-col items-center gap-4 px-5">
            {user ? (
              // Se ESTÁ logado
              <>
                <span className="text-amarelo-claro text-lg">
                  Olá, {user.nome.split(' ')[0]}!
                </span>
                <button
                  onClick={handleLogout}
                  className="font-medium text-lg bg-rosa-claro text-roxo-escuro px-4 py-2 rounded w-full max-w-xs"
                >
                  Sair
                </button>
              </>
            ) : (
              // Se NÃO está logado
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="font-medium text-lg bg-amarelo-claro text-roxo-escuro px-4 py-2 rounded w-full max-w-xs text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}