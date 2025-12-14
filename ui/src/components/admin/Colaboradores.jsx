import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Link as LinkIcon, 
  Trash, 
  PencilSimple, 
  Copy, 
  Check, 
  MagnifyingGlass,
  X,
  Warning,
  PaperPlaneTilt, 
  CheckCircle,
  Clock,
  Funnel,
  Users
} from '@phosphor-icons/react';
import api from '../../lib/api';
import { Squircle } from "corner-smoothing";

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos"); // 'todos', 'concluido', 'pendente'
  
  // --- ESTADOS DE CONTROLE ---
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalConfigLinkAberto, setModalConfigLinkAberto] = useState(false); 
  const [modalLinkAberto, setModalLinkAberto] = useState(false);
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null); 

  const [selectedUser, setSelectedUser] = useState(null); 
  const [configLink, setConfigLink] = useState({ tipo: 'voluntaria', lider: 'false' });
  const [linkGerado, setLinkGerado] = useState("");
  const [usuarioLink, setUsuarioLink] = useState("");
  const [copiado, setCopiado] = useState(false);

  const initialFormState = {
    nome_completo: "",
    email: "",
    departamento: "",
    cargo: "",
    data_entrada: "",
    password: "",
    admin: false
  };
  const [formData, setFormData] = useState(initialFormState);

  async function fetchColaboradores() {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      // Apenas colaboradores (não admins)
      const apenasColaboradores = response.data.filter(u => !u.admin);
      setColaboradores(apenasColaboradores);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchColaboradores();
  }, []);

  // --- LÓGICA DE FILTRAGEM ---
  const colaboradoresFiltrados = colaboradores.filter(c => {
    // 1. Filtro de Texto
    const matchBusca = (c.nome_completo?.toLowerCase() || "").includes(busca.toLowerCase()) ||
                       (c.email?.toLowerCase() || "").includes(busca.toLowerCase());
    
    // 2. Filtro de Status
    let matchStatus = true;
    if (filtroStatus === 'concluido') matchStatus = c.status_offboarding === 'Concluído';
    if (filtroStatus === 'pendente') matchStatus = c.status_offboarding === 'Pendente';

    return matchBusca && matchStatus;
  });

  // --- ESTATÍSTICAS ---
  const total = colaboradores.length;
  const respondidos = colaboradores.filter(c => c.status_offboarding === 'Concluído').length;
  const pendentes = total - respondidos;

  // ... (Funções de Modal e Submit mantêm-se iguais, copiei a lógica abaixo para integridade) ...

  function handleAbrirEdicao(colab) {
      setEditandoUsuario(colab);
      setFormData({
          nome_completo: colab.nome_completo || "",
          email: colab.email || "",
          departamento: colab.departamento || "",
          cargo: colab.cargo || "",
          data_entrada: colab.data_entrada ? String(colab.data_entrada).split('T')[0] : "", 
          password: "",
          admin: false
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
      const payload = { ...formData, admin: false };
      if (editandoUsuario) {
          const id = editandoUsuario.usuario_id || editandoUsuario.id;
          if (!payload.password) delete payload.password; 
          await api.put(`/usuarios/${id}`, payload);
          alert("Colaborador atualizado com sucesso!");
      } else {
          payload.password = payload.password || "blip123";
          payload.motivo_saida = "N/A"; 
          payload.data_saida = null;
          await api.post('/usuarios', payload);
          alert("Colaborador cadastrado com sucesso!");
      }
      setModalCadastroAberto(false);
      setFormData(initialFormState);
      fetchColaboradores(); 
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      alert("Erro ao salvar colaborador.");
    }
  }

  function handleAbrirDelete(colab) {
      setUsuarioParaDeletar(colab);
      setModalDeleteAberto(true);
  }

  async function confirmarDelete() {
      if (!usuarioParaDeletar) return;
      try {
          const id = usuarioParaDeletar.usuario_id || usuarioParaDeletar.id;
          await api.delete(`/usuarios/${id}`);
          alert("Colaborador removido.");
          setModalDeleteAberto(false);
          setUsuarioParaDeletar(null);
          fetchColaboradores(); 
      } catch (error) {
          console.error("❌ Erro ao deletar:", error);
          alert("Erro ao excluir.");
      }
  }

  function abrirConfiguracaoLink(user) {
      setSelectedUser(user);
      setConfigLink({ tipo: 'voluntaria', lider: 'false' });
      setModalConfigLinkAberto(true);
  }

  async function handleGerarLinkFinal() {
    if (!selectedUser) return;
    try {
      const id = selectedUser.usuario_id || selectedUser.id;
      const response = await api.get(`/usuarios/${id}/gerar-link`, {
          params: { tipo: configLink.tipo, lider: configLink.lider }
      });
      setLinkGerado(response.data.link);
      setUsuarioLink(selectedUser.nome_completo);
      setModalConfigLinkAberto(false);
      setModalLinkAberto(true);
      setCopiado(false);
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      alert("Erro ao gerar link.");
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(linkGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-primary font-title text-4xl">Colaboradores (Offboarding)</h1>
            <p className="text-primary/60 font-corpo text-sm mt-1">Acompanhe quem já respondeu ao formulário.</p>
        </div>
        <button 
            onClick={handleAbrirCadastro} 
            className="btn btn-accent text-primary font-corpo rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap"
        >
            <UserPlus size={24} />
            Novo Colaborador
        </button>
      </div>

      {/* --- CARDS DE RESUMO (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Squircle cornerRadius={16} cornerSmoothing={1} className="bg-secondary/10 p-4 flex items-center gap-4">
              <div className="bg-white p-3 rounded-full text-primary"><Users size={24} /></div>
              <div>
                  <p className="text-sm text-primary/60">Total Cadastrados</p>
                  <p className="text-2xl font-bold text-primary">{total}</p>
              </div>
          </Squircle>
          <Squircle cornerRadius={16} cornerSmoothing={1} className="bg-green-100 p-4 flex items-center gap-4">
              <div className="bg-white p-3 rounded-full text-green-600"><CheckCircle size={24} weight="fill" /></div>
              <div>
                  <p className="text-sm text-green-800/70">Responderam</p>
                  <p className="text-2xl font-bold text-green-700">{respondidos}</p>
              </div>
          </Squircle>
          <Squircle cornerRadius={16} cornerSmoothing={1} className="bg-gray-100 p-4 flex items-center gap-4">
              <div className="bg-white p-3 rounded-full text-gray-500"><Clock size={24} weight="fill" /></div>
              <div>
                  <p className="text-sm text-gray-600/70">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-600">{pendentes}</p>
              </div>
          </Squircle>
      </div>

      {/* --- FILTROS E BUSCA --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/50 p-2 rounded-2xl border border-white/20">
        <div className="relative w-full md:w-1/3">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
            <input 
                type="text" 
                placeholder="Buscar colaborador..." 
                className="input input-sm w-full pl-10 bg-transparent border-none text-primary placeholder-primary/50 focus:outline-none"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />
        </div>
        
        <div className="h-6 w-px bg-primary/10 hidden md:block"></div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            <button 
                onClick={() => setFiltroStatus('todos')}
                className={`btn btn-sm rounded-lg border-none font-normal ${filtroStatus === 'todos' ? 'bg-primary text-white' : 'bg-transparent text-primary/70 hover:bg-primary/5'}`}
            >
                Todos
            </button>
            <button 
                onClick={() => setFiltroStatus('concluido')}
                className={`btn btn-sm rounded-lg border-none gap-2 font-normal ${filtroStatus === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-transparent text-primary/70 hover:bg-green-50'}`}
            >
                <CheckCircle size={16} weight="fill"/> Concluídos
            </button>
            <button 
                onClick={() => setFiltroStatus('pendente')}
                className={`btn btn-sm rounded-lg border-none gap-2 font-normal ${filtroStatus === 'pendente' ? 'bg-gray-200 text-gray-600' : 'bg-transparent text-primary/70 hover:bg-gray-100'}`}
            >
                <Clock size={16} weight="fill"/> Pendentes
            </button>
        </div>
      </div>

      {/* --- TABELA --- */}
      <div className="flex-1 overflow-y-auto pr-2">
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
                                <th className="w-[20%] bg-white/90">Cargo</th>
                                <th className="w-[15%] text-center bg-white/90">Status</th>
                                <th className="w-[15%] text-center bg-white/90">Data Resp.</th>
                                <th className="w-[20%] text-center bg-white/90">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="font-corpo text-primary/80">
                            {colaboradoresFiltrados.map((colab) => (
                                <tr key={colab.usuario_id || colab.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="truncate font-bold">{colab.nome_completo}</td>
                                    <td className="truncate text-sm">{colab.cargo}</td>
                                    
                                    {/* STATUS */}
                                    <td className="text-center">
                                        {colab.status_offboarding === 'Concluído' ? (
                                            <div className="badge badge-success gap-2 text-white font-bold text-xs p-3">
                                                <CheckCircle size={14} weight="fill" /> Concluído
                                            </div>
                                        ) : (
                                            <div className="badge badge-ghost gap-2 text-primary/60 text-xs p-3 bg-gray-200 border-none">
                                                <Clock size={14} weight="fill" /> Pendente
                                            </div>
                                        )}
                                    </td>

                                    {/* DATA */}
                                    <td className="text-center text-sm">
                                        {colab.data_ultima_entrevista 
                                            ? new Date(colab.data_ultima_entrevista).toLocaleDateString('pt-BR') 
                                            : '-'
                                        }
                                    </td>

                                    <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => abrirConfiguracaoLink(colab)}
                                                className="btn btn-sm btn-circle btn-ghost text-accent tooltip tooltip-left" 
                                                data-tip="Gerar Link"
                                            >
                                                <LinkIcon size={20} weight="bold" />
                                            </button>
                                            <button 
                                                onClick={() => handleAbrirEdicao(colab)}
                                                className="btn btn-sm btn-circle btn-ghost text-primary/50 hover:text-primary tooltip tooltip-left"
                                                data-tip="Editar"
                                            >
                                                <PencilSimple size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleAbrirDelete(colab)}
                                                className="btn btn-sm btn-circle btn-ghost text-error/70 hover:text-error tooltip tooltip-left"
                                                data-tip="Excluir"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {colaboradoresFiltrados.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-4 text-primary/50 italic">Nenhum colaborador encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>

      {/* --- MODAIS DE CADASTRO, DELETE, LINK (Mantidos) --- */}
      {modalCadastroAberto && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 rounded-3xl p-8 max-w-2xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-2xl text-primary">
                    {editandoUsuario ? "Editar Colaborador" : "Cadastrar Colaborador"}
                </h3>
                <button onClick={() => setModalCadastroAberto(false)} className="btn btn-sm btn-circle btn-ghost text-primary"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSalvar} className="flex flex-col gap-4 font-corpo">
                {/* Campos do formulário (iguais aos anteriores) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label text-primary">Nome Completo</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-secondary/10" 
                            value={formData.nome_completo} 
                            onChange={e => setFormData({...formData, nome_completo: e.target.value})} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-primary">Email Corporativo</label>
                        <input required type="email" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.email} 
                             onChange={e => setFormData({...formData, email: e.target.value})} 
                             disabled={!!editandoUsuario} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-primary">Departamento</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.departamento} 
                             onChange={e => setFormData({...formData, departamento: e.target.value})} 
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
                        <label className="label text-primary">Data de Entrada</label>
                        <input required type="date" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.data_entrada} 
                             onChange={e => setFormData({...formData, data_entrada: e.target.value})} 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-primary">Senha (Opcional)</label>
                        <input type="password" placeholder="Gerada autom. se vazio" className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.password} 
                             onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="modal-action mt-8">
                    <button type="button" onClick={() => setModalCadastroAberto(false)} className="btn btn-ghost text-primary/70">Cancelar</button>
                    <button type="submit" className="btn btn-accent text-primary px-8 rounded-xl">
                        {editandoUsuario ? "Salvar Alterações" : "Cadastrar Colaborador"}
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
                    <h3 className="font-title text-2xl text-primary">Excluir Colaborador?</h3>
                    <p className="font-corpo text-primary/70">
                        <strong>{usuarioParaDeletar.nome_completo}</strong> será removido.
                    </p>
                    <div className="flex gap-4 mt-4 w-full">
                        <button onClick={() => setModalDeleteAberto(false)} className="btn btn-ghost flex-1">Cancelar</button>
                        <button onClick={confirmarDelete} className="btn btn-error flex-1 text-white">Sim, Excluir</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL CONFIGURAR LINK */}
      {modalConfigLinkAberto && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 rounded-3xl p-8 max-w-md shadow-2xl overflow-visible">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-xl text-primary">Gerar Link</h3>
                <button onClick={() => setModalConfigLinkAberto(false)} className="btn btn-sm btn-circle btn-ghost text-primary"><X size={24}/></button>
            </div>
            
            <div className="mb-4">
                <p className="font-bold text-primary">{selectedUser.nome_completo}</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="form-control">
                    <span className="label-text font-bold text-primary mb-2">Tipo de Saída</span>
                    <select 
                        className="select select-bordered w-full bg-secondary/10"
                        value={configLink.tipo}
                        onChange={(e) => setConfigLink({...configLink, tipo: e.target.value})}
                    >
                        <option value="voluntaria">Voluntária (Pediu Demissão)</option>
                        <option value="involuntaria">Involuntária (Demitido)</option>
                    </select>
                </div>
                <div className="form-control">
                    <span className="label-text font-bold text-primary mb-2">Era Líder?</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="lider" className="radio radio-primary" checked={configLink.lider === 'true'} onChange={() => setConfigLink({...configLink, lider: 'true'})} /> Sim
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="lider" className="radio radio-primary" checked={configLink.lider === 'false'} onChange={() => setConfigLink({...configLink, lider: 'false'})} /> Não
                        </label>
                    </div>
                </div>
                <button onClick={handleGerarLinkFinal} className="btn btn-accent w-full mt-4 rounded-xl text-primary font-bold">
                    <PaperPlaneTilt size={20} weight="bold" /> Gerar Link
                </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LINK GERADO */}
      {modalLinkAberto && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 rounded-3xl p-8 shadow-2xl">
            <h3 className="font-title text-2xl text-primary mb-2">Link Gerado! 🚀</h3>
            <div className="bg-secondary/10 p-4 rounded-xl flex items-center gap-2 border border-secondary/20 my-4">
                <code className="text-sm break-all text-primary font-mono w-full">{linkGerado}</code>
                <button onClick={copyToClipboard} className={`btn btn-square btn-sm ${copiado ? 'btn-success' : 'btn-ghost'}`}>
                    {copiado ? <Check size={20} className="text-white"/> : <Copy size={20} className="text-primary"/>}
                </button>
            </div>
            <button onClick={() => setModalLinkAberto(false)} className="btn btn-primary rounded-xl w-full">Concluído</button>
          </div>
        </div>
      )}
    </div>
  );
}