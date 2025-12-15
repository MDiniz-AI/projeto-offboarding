import React, { useState, useEffect } from 'react';
import { 
  ShieldPlus, 
  Trash, 
  PencilSimple, 
  MagnifyingGlass,
  X,
  Warning,
  ShieldCheck
} from '@phosphor-icons/react';
import api from '../../lib/api';

export default function Administradores() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null); 

  const initialFormState = {
    nome_completo: "",
    email: "",
    departamento: "",
    cargo: "",
    data_entrada: "", 
    password: "",
    admin: true 
  };
  const [formData, setFormData] = useState(initialFormState);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      // FILTRO: Apenas Admins
      const apenasAdmins = response.data.filter(u => u.admin);
      setAdmins(apenasAdmins);
    } catch (error) {
      console.error("Erro ao buscar admins:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  function handleAbrirEdicao(user) {
      setEditandoUsuario(user);
      setFormData({
          nome_completo: user.nome_completo || "",
          email: user.email || "",
          departamento: user.departamento || "",
          cargo: user.cargo || "",
          data_entrada: user.data_entrada ? String(user.data_entrada).split('T')[0] : "", 
          password: "",
          admin: true
      });
      setModalCadastroAberto(true);
  }

  function handleAbrirCadastro() {
      setEditandoUsuario(null);
      setFormData(initialFormState);
      setModalCadastroAberto(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    try {
      const payload = { ...formData, admin: true };

      if (editandoUsuario) {
          const id = editandoUsuario.usuario_id || editandoUsuario.id;
          if (!payload.password) delete payload.password; 
          await api.put(`/usuarios/${id}`, payload);
          alert("Administrador atualizado!");
      } else {
          payload.password = payload.password || "admin123"; 
          payload.motivo_saida = "Gestão"; 
          payload.data_saida = null;
          await api.post('/usuarios', payload);
          alert("Administrador cadastrado!");
      }
      setModalCadastroAberto(false);
      setFormData(initialFormState);
      fetchAdmins(); 
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      alert("Erro ao salvar administrador.");
    }
  }

  function handleAbrirDelete(user) {
      setUsuarioParaDeletar(user);
      setModalDeleteAberto(true);
  }

  async function confirmarDelete() {
      if (!usuarioParaDeletar) return;
      try {
          const id = usuarioParaDeletar.usuario_id || usuarioParaDeletar.id;
          await api.delete(`/usuarios/${id}`);
          alert("Administrador removido.");
          setModalDeleteAberto(false);
          setUsuarioParaDeletar(null);
          fetchAdmins(); 
      } catch (error) {
          console.error("❌ Erro ao deletar:", error);
          alert("Erro ao excluir. Verifique se não é o único admin.");
      }
  }

  const adminsFiltrados = admins.filter(c => 
    (c.nome_completo?.toLowerCase() || "").includes(busca.toLowerCase()) ||
    (c.email?.toLowerCase() || "").includes(busca.toLowerCase())
  );

  return (
    // CONTAINER PRINCIPAL: Fundo escuro (gray-900)
    <div className="flex flex-col gap-6 bg-gray-900 min-h-screen p-4 md:pr-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-white font-title text-4xl">Gestão de Acessos (Admins)</h1>
            <p className="text-gray-400 font-corpo text-sm mt-1">Gerencie quem tem acesso a este painel administrativo.</p>
        </div>
        <button 
            onClick={handleAbrirCadastro} 
            // Botão Accent com sombra colorida (Glow)
            className="btn btn-accent text-gray-900 font-bold font-corpo rounded-xl shadow-lg shadow-accent/20 flex items-center gap-2 whitespace-nowrap border-none hover:scale-105 transition-transform"
        >
            <ShieldPlus size={24} weight="bold" />
            Novo Administrador
        </button>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="relative w-full md:w-1/3">
        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
            type="text" 
            placeholder="Buscar administrador..." 
            // Input escuro com texto claro
            className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        {loading ? (
            <div className="flex justify-center items-center h-40 text-gray-400">
                <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
        ) : (
            // TABELA CARD: Fundo gray-800 + Borda
            <div className="bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-700 p-4">
                <div className="overflow-x-auto rounded-xl">
                    <table className="table table-zebra table-fixed w-full">
                        {/* HEADER: Fundo mais escuro (gray-900) */}
                        <thead className="text-white font-title text-lg border-b border-gray-700">
                            <tr>
                                <th className="w-[30%] bg-gray-900 border-none">Nome</th>
                                <th className="w-[25%] bg-gray-900 border-none">Cargo</th>
                                <th className="w-[25%] bg-gray-900 border-none">Email</th>
                                <th className="w-[20%] text-center bg-gray-900 border-none">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="font-corpo text-gray-300">
                            {adminsFiltrados.map((user) => (
                                <tr key={user.usuario_id || user.id} className="hover:bg-gray-700/50 transition-colors border-none">
                                    <td className="truncate flex items-center gap-2 border-none">
                                        <ShieldCheck size={18} className="text-accent" weight="fill"/>
                                        <span className="font-bold text-white">{user.nome_completo}</span>
                                    </td>
                                    <td className="truncate border-none text-gray-400">{user.cargo}</td>
                                    <td className="text-sm truncate border-none text-gray-400">{user.email}</td>
                                    <td className="text-center border-none">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleAbrirEdicao(user)}
                                                className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:bg-gray-700 hover:text-white tooltip tooltip-left"
                                                data-tip="Editar"
                                            >
                                                <PencilSimple size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleAbrirDelete(user)}
                                                className="btn btn-sm btn-circle btn-ghost text-red-400 hover:bg-red-900/30 hover:text-red-300 tooltip tooltip-left"
                                                data-tip="Excluir"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {adminsFiltrados.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500 italic border-none">Nenhum administrador encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>

      {/* MODAL CADASTRO ADMIN */}
      {modalCadastroAberto && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box bg-gray-800 rounded-3xl p-8 max-w-2xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-2xl text-white">
                    {editandoUsuario ? "Editar Admin" : "Cadastrar Admin"}
                </h3>
                <button onClick={() => setModalCadastroAberto(false)} className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white hover:bg-gray-700"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSalvar} className="flex flex-col gap-4 font-corpo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label text-gray-300">Nome</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" 
                            value={formData.nome_completo} 
                            onChange={e => setFormData({...formData, nome_completo: e.target.value})} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Email</label>
                        <input required type="email" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent disabled:bg-gray-800 disabled:text-gray-500" 
                             value={formData.email} 
                             onChange={e => setFormData({...formData, email: e.target.value})} 
                             disabled={!!editandoUsuario} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Cargo</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" 
                             value={formData.cargo} 
                             onChange={e => setFormData({...formData, cargo: e.target.value})} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Departamento</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" 
                             value={formData.departamento} 
                             onChange={e => setFormData({...formData, departamento: e.target.value})} 
                        />
                    </div>
                    
                    <div className="form-control hidden">
                        <input type="date" value={formData.data_entrada || new Date().toISOString().split('T')[0]} readOnly />
                    </div>

                    <div className="form-control col-span-2">
                        <label className="label text-gray-300">Senha de Acesso</label>
                        <input 
                             type="password" 
                             placeholder={editandoUsuario ? "Deixe vazio para manter a atual" : "Crie uma senha forte"} 
                             className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" 
                             value={formData.password} 
                             onChange={e => setFormData({...formData, password: e.target.value})}
                             required={!editandoUsuario} 
                        />
                    </div>
                </div>

                <div className="modal-action mt-8">
                    <button type="button" onClick={() => setModalCadastroAberto(false)} className="btn btn-ghost text-gray-400 hover:text-white hover:bg-gray-700">Cancelar</button>
                    <button type="submit" className="btn btn-accent text-gray-900 font-bold px-8 rounded-xl shadow-lg shadow-accent/20">
                        {editandoUsuario ? "Salvar" : "Cadastrar Admin"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modalDeleteAberto && usuarioParaDeletar && (
        <div className="modal modal-open backdrop-blur-sm">
            <div className="modal-box bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
                <div className="flex flex-col items-center text-center gap-4">
                    <Warning size={48} className="text-red-500" />
                    <h3 className="font-title text-2xl text-white">Remover Acesso?</h3>
                    <p className="font-corpo text-gray-300">
                        <strong>{usuarioParaDeletar.nome_completo}</strong> perderá o acesso ao painel.
                    </p>
                    <div className="flex gap-4 mt-4 w-full">
                        <button onClick={() => setModalDeleteAberto(false)} className="btn btn-ghost flex-1 text-gray-400 hover:bg-gray-700 hover:text-white">Cancelar</button>
                        <button onClick={confirmarDelete} className="btn btn-error flex-1 text-white font-bold shadow-lg shadow-error/20">Remover</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}