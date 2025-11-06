/* eslint-disable no-irregular-whitespace */
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/not-found"
import { lazy, Suspense } from "react"
import { Loading } from "./components/loading"
import { PacientesProvider } from "./context/PacienteContext"
import { DialogflowChat } from "./components/vitas"

function App() {

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


return (
  <BrowserRouter>
    <PacientesProvider>
      {/* Chatbot sempre disponível */}
      <DialogflowChat />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route>
            <Route index element={<Home />} />
            <Route path="/integrantes" element={<Integrantes />} />
            <Route path="/" element={<Home />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastrar" element={<SignUp />} />
            <Route path="/teste" element={<Teste />} />
            <Route path="/faq/:id?" element={<Faq />} />
            <Route path="/about" element={<About />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </PacientesProvider>
  </BrowserRouter>
);
}

export default App