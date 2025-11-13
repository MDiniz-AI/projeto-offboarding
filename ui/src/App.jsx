import { StrictMode, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import Form from "./pages/Form.jsx";

function App() {
  const [count, setCount] = useState(0);
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Add your Clerk Publishable Key to the .env file");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
