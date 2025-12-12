import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";

// Componentes Admin (Assumindo que você vai criá-los ou já tem)
import BlocoPrincipalAdm from "../components/admin/BlocoPrincipalAdm";
import FormularioAdm from "../components/admin/FormularioAdm";
import Colaboradores from "../components/admin/Colaboradores";
import Times from "../components/admin/Times";
import Config from "../components/admin/Config";
import HomeAdm from "../components/admin/HomeAdm";
import LoginAdm from "../components/admin/LoginAdm";

// Contexto Admin
export const AdminContext = createContext();

// --- COMPONENTE DE CONTEÚDO (Visual) ---
function AdminContent() {
  const { pagAtual, token, logout } = useContext(AdminContext);

  // 1. Se não tiver token, força a tela de Login
  if (!token) {
    return <LoginAdm />;
  }

  // 2. Se estiver logado, mostra o Dashboard
  return (
    <div className="flex">
      {/* Menu Lateral Fixo */}
      <div className="fixed left-0 top-0 h-full z-10">
        <BlocoPrincipalAdm pagina={pagAtual} onLogout={logout} />
      </div>

      {/* Área de Conteúdo (Margem para não ficar embaixo do menu) */}
      <div className="ml-[8vw] w-full p-8">
        {pagAtual === 0 && <HomeAdm />}
        {pagAtual === 1 && <Times />}
        {pagAtual === 2 && <Colaboradores />}
        {pagAtual === 3 && <FormularioAdm />}
        {pagAtual === 4 && <Config />}
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL (Lógica e Provider) ---
export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estado de Autenticação (Lê do localStorage ao iniciar)
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Estado de Navegação (Abas)
  const [pagAtual, setPagAtual] = useState(0);

  // Sincroniza URL (?pag=X) com estado interno
  useEffect(() => {
    const pagParam = searchParams.get("pag");
    let novaSecao = pagParam ? Number(pagParam) : 0;
    
    // Validação simples para não quebrar se digitarem pag=99
    if (isNaN(novaSecao) || novaSecao < 0 || novaSecao > 4) {
        novaSecao = 0;
    }
    setPagAtual(novaSecao);
  }, [searchParams]);

  // Função para Login (será chamada pelo componente LoginAdm)
  function login(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/admin'); // Redireciona/Recarrega para limpar query params se quiser
  }

  // Função para Logout
  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/admin');
  }

  return (
    <AdminContext.Provider value={{ pagAtual, token, login, logout }}>
      <AdminContent />
    </AdminContext.Provider>
  );
}