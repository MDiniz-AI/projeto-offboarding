import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Form from './pages/Form.jsx'
import Error from './pages/Error.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/admin" element={<Admin />}/>
          <Route path="/erro" element={<Error />} />
          <Route path="*" element={<Error />} /> 
        </Routes>
    </BrowserRouter>
  )
}

export default App
