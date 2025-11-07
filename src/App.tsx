/* eslint-disable no-irregular-whitespace */
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/not-found"
import { lazy, Suspense } from "react"
import { Loading } from "./components/loading"
import { PacientesProvider } from "./context/PacienteContext"
import { DialogflowChat } from "./components/vitas"
import { ConsultasProvider } from "./context/ConsultaContext"
import { AuthProvider } from "./context/AuthContext"
import { TestesProvider } from "./context/TesteContext" // <-- IMPORTAR NOVO PROVIDER

function App() {

// ... (todos os seus lazy imports)
const Home = lazy(() =>
    import("./pages/home").then((m) => ({ default: m.Home }))
  );
  const Contato = lazy(() =>
    import("./pages/contato").then((m) => ({ default: m.Contato }))
  );
  const Faq = lazy(() =>
    import("./pages/faq").then((m) => ({ default: m.Faq }))
  ); 
  const Teste = lazy(() =>
    import("./pages/teste").then((m) => ({ default: m.Teste }))
  );
  const Login = lazy(() =>
    import("./pages/login").then((m) => ({ default: m.Login }))
  );
  const SignUp = lazy(() =>
    import("./pages/SignUp").then((m) => ({ default: m.SignUp }))
  );
  const Integrantes = lazy(() =>
    import("./pages/integrantes").then((m) => ({ default: m.Integrantes }))
  );
  const About = lazy(() =>
    import("./pages/about").then((m) => ({ default: m.About }))
  );
const PacientesPage = lazy(() =>
    import("./pages/PacientesPage").then((m) => ({ default: m.PacientesPage }))
  );
  const PacienteDetalhePage = lazy(() =>
    import("./pages/PacienteDetalhePage").then((m) => ({ default: m.PacienteDetalhePage }))
);
const CadastroConsultaPage = lazy(() =>
    import("./pages/CadastroConsultaPage").then((m) => ({ default: m.CadastroConsultaPage }))
); 


return (
    <BrowserRouter>
      <AuthProvider>
        <PacientesProvider>
          <ConsultasProvider>
            <TestesProvider> {/* <-- ENVOLVER COM O NOVO PROVIDER */}
              <DialogflowChat />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route>
                    <Route index element={<PacientesPage />} />
                    <Route path="/integrantes" element={<Integrantes />} />
                    <Route path="/" element={<PacientesPage />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastrar" element={<SignUp />} />
                    <Route path="/teste" element={<Teste />} />
                    <Route path="/pacientes/:id" element={<PacienteDetalhePage />} />
                    <Route path="/faq/:id?" element={<Faq />} />
                    
                    <Route path="/about" element={<About />} />
                    
                    <Route path="/pacientes" element={<PacientesPage />} />

                    <Route path="/consultas/cadastro" element={<CadastroConsultaPage />} /> 

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </TestesProvider> {/* <-- FECHAR O PROVIDER */}
          </ConsultasProvider>
        </PacientesProvider> 
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App