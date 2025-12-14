// src/App.jsx (Corrigido)

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Form from './pages/Form.jsx'
import Error from './pages/Error.jsx'
import Admin from './pages/Admin.jsx'

// Importe o Provedor do Contexto que você criou
import { FormProvider } from './context/FormContext.jsx'; 
// NOTE: O caminho de importação (./contexts/FormContext.jsx) pode variar dependendo da sua estrutura de pastas.

function App() {
  return (
    // ENVOLVE TODA A APLICAÇÃO COM O PROVIDER. 
    // Isso garante que o estado das respostas seja mantido,
    // mesmo quando o usuário troca entre / e /admin.
    <FormProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/admin" element={<Admin />}/>
          <Route path="/erro" element={<Error />} />
          <Route path="*" element={<Error />} /> 
        </Routes>
      </BrowserRouter>
    </FormProvider>
  )
}

export default App