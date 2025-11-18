import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Form from './pages/Form.jsx'
import Error from './pages/Error.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/erro" element={<Error />} />
          <Route path="*" element={<Error />} /> 
        </Routes>
    </BrowserRouter>
  )
}

export default App
