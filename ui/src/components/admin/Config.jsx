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
    data_entrada: "", // Campo obrigatório no banco, mesmo para admin
    password: "",
    admin: true // Sempre true aqui
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
          payload.password = payload.password || "admin123"; // Senha padrão ou obrigatória
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
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-primary font-title text-4xl">Gestão de Acessos (Admins)</h1>
            <p className="text-primary/60 font-corpo text-sm mt-1">Gerencie quem tem acesso a este painel administrativo.</p>
        </div>
        <button 
            onClick={handleAbrirCadastro} 
            className="btn btn-primary text-white font-corpo rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap"
        >
            <ShieldPlus size={24} />
            Novo Administrador
        </button>
      </div>

      <div className="relative w-full md:w-1/3">
        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
        <input 
            type="text" 
            placeholder="Buscar administrador..." 
            className="input input-bordered w-full pl-10 bg-secondary/10 border-none rounded-xl text-primary placeholder-primary/50 focus:outline-accent"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        {loading ? (
            <div className="flex justify-center items-center h-40 text-primary">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        ) : (
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden border border-white/20 p-4">
                <div className="overflow-x-auto rounded-xl">
                    <table className="table table-zebra table-fixed w-full">
                        <thead className="text-primary font-title text-lg border-b border-primary/10">
                            <tr>
                                <th className="w-[30%] bg-white/90">Nome</th>
                                <th className="w-[25%] bg-white/90">Cargo</th>
                                <th className="w-[25%] bg-white/90">Email</th>
                                <th className="w-[20%] text-center bg-white/90">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="font-corpo text-primary/80">
                            {adminsFiltrados.map((user) => (
                                <tr key={user.usuario_id || user.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="truncate flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-accent"/>
                                        <span className="font-bold">{user.nome_completo}</span>
                                    </td>
                                    <td className="truncate">{user.cargo}</td>
                                    <td className="text-sm truncate">{user.email}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleAbrirEdicao(user)}
                                                className="btn btn-sm btn-circle btn-ghost text-primary/50 hover:text-primary tooltip tooltip-left"
                                                data-tip="Editar"
                                            >
                                                <PencilSimple size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleAbrirDelete(user)}
                                                className="btn btn-sm btn-circle btn-ghost text-error/70 hover:text-error tooltip tooltip-left"
                                                data-tip="Excluir"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>

      {/* MODAL CADASTRO ADMIN */}
      {modalCadastroAberto && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 rounded-3xl p-8 max-w-2xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-2xl text-primary">
                    {editandoUsuario ? "Editar Admin" : "Cadastrar Admin"}
                </h3>
                <button onClick={() => setModalCadastroAberto(false)} className="btn btn-sm btn-circle btn-ghost text-primary"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSalvar} className="flex flex-col gap-4 font-corpo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label text-primary">Nome</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-secondary/10" 
                            value={formData.nome_completo} 
                            onChange={e => setFormData({...formData, nome_completo: e.target.value})} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-primary">Email</label>
                        <input required type="email" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.email} 
                             onChange={e => setFormData({...formData, email: e.target.value})} 
                             disabled={!!editandoUsuario} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-primary">Cargo</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.cargo} 
                             onChange={e => setFormData({...formData, cargo: e.target.value})} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-primary">Departamento</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.departamento} 
                             onChange={e => setFormData({...formData, departamento: e.target.value})} 
                        />
                    </div>
                    {/* Campo oculto ou fixo para data_entrada se o banco exigir */}
                    <div className="form-control hidden">
                        <input type="date" value={formData.data_entrada || new Date().toISOString().split('T')[0]} readOnly />
                    </div>

                    <div className="form-control col-span-2">
                        <label className="label text-primary">Senha de Acesso</label>
                        <input 
                             type="password" 
                             placeholder={editandoUsuario ? "Deixe vazio para manter a atual" : "Crie uma senha forte"} 
                             className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.password} 
                             onChange={e => setFormData({...formData, password: e.target.value})}
                             required={!editandoUsuario} 
                        />
                    </div>
                </div>

                <div className="modal-action mt-8">
                    <button type="button" onClick={() => setModalCadastroAberto(false)} className="btn btn-ghost text-primary/70">Cancelar</button>
                    <button type="submit" className="btn btn-primary text-white px-8 rounded-xl">
                        {editandoUsuario ? "Salvar" : "Cadastrar Admin"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modalDeleteAberto && usuarioParaDeletar && (
        <div className="modal modal-open">
            <div className="modal-box bg-base-100 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center text-center gap-4">
                    <Warning size={48} className="text-error" />
                    <h3 className="font-title text-2xl text-primary">Remover Acesso?</h3>
                    <p className="font-corpo text-primary/70">
                        <strong>{usuarioParaDeletar.nome_completo}</strong> perderá o acesso ao painel.
                    </p>
                    <div className="flex gap-4 mt-4 w-full">
                        <button onClick={() => setModalDeleteAberto(false)} className="btn btn-ghost flex-1">Cancelar</button>
                        <button onClick={confirmarDelete} className="btn btn-error flex-1 text-white">Remover</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}