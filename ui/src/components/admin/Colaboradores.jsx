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
  Users,
  CaretUp,   
  CaretDown,
  EnvelopeSimple, 
  Buildings,
  ArrowsDownUp 
} from '@phosphor-icons/react';
import api from '../../lib/api';
import { Squircle } from "corner-smoothing";

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos"); 
  
  // ESTADO DE ORDENAÇÃO
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome_completo', direcao: 'asc' });

  // --- ESTADOS DE MODAIS ---
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalConfigLinkAberto, setModalConfigLinkAberto] = useState(false); 
  const [modalLinkAberto, setModalLinkAberto] = useState(false);
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [configLink, setConfigLink] = useState({ tipo: 'voluntaria', lider: 'false' });
  const [linkGerado, setLinkGerado] = useState("");
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

  // --- FUNÇÃO DE ORDENAÇÃO ---
  const handleOrdenar = (campo) => {
    setOrdenacao((prev) => {
      if (prev.campo === campo) {
        return { campo, direcao: prev.direcao === 'asc' ? 'desc' : 'asc' };
      }
      return { campo, direcao: 'asc' };
    });
  };

  const RenderSortIcon = ({ campo }) => {
    if (ordenacao.campo !== campo) return <ArrowsDownUp size={14} className="text-gray-600 opacity-50" />;
    return ordenacao.direcao === 'asc' 
      ? <CaretUp size={14} className="text-accent" weight="bold" /> 
      : <CaretDown size={14} className="text-accent" weight="bold" />;
  };

  // --- LÓGICA DE FILTRAGEM E CLASSIFICAÇÃO ---
  const processarDados = () => {
    let dados = colaboradores.filter(c => {
      const termo = busca.toLowerCase();
      const matchTexto = (c.nome_completo?.toLowerCase() || "").includes(termo) ||
                         (c.email?.toLowerCase() || "").includes(termo) ||
                         (c.departamento?.toLowerCase() || "").includes(termo);
      
      let matchStatus = true;
      if (filtroStatus === 'concluido') matchStatus = c.status_offboarding === 'Concluído';
      if (filtroStatus === 'pendente') matchStatus = c.status_offboarding === 'Pendente';

      return matchTexto && matchStatus;
    });

    return [...dados].sort((a, b) => {
      const { campo, direcao } = ordenacao;
      let valorA, valorB;

      switch (campo) {
        case 'nome_completo':
          valorA = a.nome_completo || "";
          valorB = b.nome_completo || "";
          break;
        case 'status':
          valorA = a.status_offboarding || "";
          valorB = b.status_offboarding || "";
          break;
        case 'data':
          valorA = a.data_ultima_entrevista ? new Date(a.data_ultima_entrevista).getTime() : 0;
          valorB = b.data_ultima_entrevista ? new Date(b.data_ultima_entrevista).getTime() : 0;
          return direcao === 'asc' ? valorA - valorB : valorB - valorA;
        default:
          return 0;
      }

      return direcao === 'asc' 
        ? valorA.localeCompare(valorB) 
        : valorB.localeCompare(valorA);
    });
  };

  const listaFinal = processarDados();
  const total = colaboradores.length;
  const respondidos = colaboradores.filter(c => c.status_offboarding === 'Concluído').length;
  const pendentes = total - respondidos;

  // --- FUNÇÕES DE AÇÃO ---
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
      if (!payload.data_entrada) payload.data_entrada = new Date().toISOString().split('T')[0];

      if (editandoUsuario) {
          const id = editandoUsuario.usuario_id || editandoUsuario.id;
          if (!payload.password) delete payload.password; 
          await api.put(`/usuarios/${id}`, payload);
          alert("Colaborador atualizado!");
      } else {
          payload.password = payload.password || "blip123";
          payload.motivo_saida = "N/A"; 
          payload.data_saida = null;
          await api.post('/usuarios', payload);
          alert("Colaborador cadastrado!");
      }
      setModalCadastroAberto(false);
      setFormData(initialFormState);
      fetchColaboradores(); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar.");
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
          alert("Removido com sucesso.");
          setModalDeleteAberto(false);
          setUsuarioParaDeletar(null);
          fetchColaboradores(); 
      } catch (error) {
          console.error("Erro ao deletar:", error);
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
      setModalConfigLinkAberto(false);
      setModalLinkAberto(true);
      setCopiado(false);
    } catch (error) {
      console.error("Erro link:", error);
      alert("Erro ao gerar link.");
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(linkGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6 bg-gray-900 min-h-screen p-4 md:pr-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-white font-title text-4xl">Colaboradores (Offboarding)</h1>
            <p className="text-gray-400 font-corpo text-sm mt-1">Gerencie os acessos e status dos formulários.</p>
        </div>
        <button 
            onClick={handleAbrirCadastro} 
            className="btn btn-accent text-gray-900 font-bold font-corpo rounded-xl shadow-lg shadow-accent/20 flex items-center gap-2 whitespace-nowrap border-none hover:scale-105 transition-transform"
        >
            <UserPlus size={24} weight="bold" />
            Novo Colaborador
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Squircle cornerRadius={16} cornerSmoothing={1} className="bg-gray-800 border border-gray-700 p-4 flex items-center gap-4 shadow-lg">
              <div className="bg-gray-700 p-3 rounded-full text-white"><Users size={24} /></div>
              <div>
                  <p className="text-sm text-gray-400">Total Cadastrados</p>
                  <p className="text-2xl font-bold text-white">{total}</p>
              </div>
          </Squircle>
          <Squircle cornerRadius={16} cornerSmoothing={1} className="bg-emerald-900/30 border border-emerald-800/50 p-4 flex items-center gap-4 shadow-lg">
              <div className="bg-emerald-800 p-3 rounded-full text-emerald-100"><CheckCircle size={24} weight="fill" /></div>
              <div>
                  <p className="text-sm text-emerald-400/80">Responderam</p>
                  <p className="text-2xl font-bold text-emerald-400">{respondidos}</p>
              </div>
          </Squircle>
          <Squircle cornerRadius={16} cornerSmoothing={1} className="bg-gray-800 border border-gray-700 p-4 flex items-center gap-4 shadow-lg">
              <div className="bg-gray-700 p-3 rounded-full text-gray-400"><Clock size={24} weight="fill" /></div>
              <div>
                  <p className="text-sm text-gray-400/80">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-300">{pendentes}</p>
              </div>
          </Squircle>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-md">
        <div className="relative w-full md:w-1/3">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Buscar por nome, email ou área..." 
                className="input input-sm w-full pl-10 bg-gray-700 border-none text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />
        </div>
        <div className="h-6 w-px bg-gray-600 hidden md:block"></div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            <button onClick={() => setFiltroStatus('todos')} className={`btn btn-sm rounded-lg border-none font-normal ${filtroStatus === 'todos' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white'}`}>Todos</button>
            <button onClick={() => setFiltroStatus('concluido')} className={`btn btn-sm rounded-lg border-none gap-2 font-normal ${filtroStatus === 'concluido' ? 'bg-emerald-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white'}`}><CheckCircle size={16} weight="fill"/> Concluídos</button>
            <button onClick={() => setFiltroStatus('pendente')} className={`btn btn-sm rounded-lg border-none gap-2 font-normal ${filtroStatus === 'pendente' ? 'bg-gray-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white'}`}><Clock size={16} weight="fill"/> Pendentes</button>
        </div>
      </div>

      {/* TABELA */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <div className="flex justify-center items-center h-40 text-gray-400">
                <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
        ) : (
            <div className="bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-700 p-4">
                <div className="overflow-x-auto rounded-xl">
                    <table className="table table-zebra table-fixed w-full">
                        <thead className="text-white font-title text-lg border-b border-gray-700">
                            <tr>
                                <th className="w-[25%] bg-gray-900 border-none cursor-pointer hover:bg-gray-700/50 transition-colors select-none" onClick={() => handleOrdenar('nome_completo')}>
                                    <div className="flex items-center gap-2 text-white">Nome <RenderSortIcon campo="nome_completo" /></div>
                                </th>
                                <th className="w-[20%] bg-gray-900 border-none">Email / Área</th>
                                <th className="w-[15%] bg-gray-900 border-none">Cargo</th>
                                <th className="w-[15%] text-center bg-gray-900 border-none cursor-pointer hover:bg-gray-700/50 transition-colors select-none" onClick={() => handleOrdenar('status')}>
                                    <div className="flex items-center justify-center gap-2 text-white">Status <RenderSortIcon campo="status" /></div>
                                </th>
                                <th className="w-[15%] text-center bg-gray-900 border-none cursor-pointer hover:bg-gray-700/50 transition-colors select-none" onClick={() => handleOrdenar('data')}>
                                    <div className="flex items-center justify-center gap-2 text-white">Data Resp. <RenderSortIcon campo="data" /></div>
                                </th>
                                <th className="w-[10%] text-center bg-gray-900 border-none">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="font-corpo text-gray-300">
                            {listaFinal.map((colab) => (
                                <tr key={colab.usuario_id || colab.id} className="hover:bg-gray-700/50 transition-colors border-none">
                                    <td className="truncate border-none">
                                        <div className="font-bold text-white text-base">{colab.nome_completo}</div>
                                    </td>
                                    <td className="border-none">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-gray-400 text-xs truncate"><EnvelopeSimple size={14} /> {colab.email}</div>
                                            <div className="flex items-center gap-1 text-gray-300 text-sm font-semibold truncate"><Buildings size={14} className="text-blue-400"/> {colab.departamento}</div>
                                        </div>
                                    </td>
                                    <td className="truncate text-sm text-gray-400 border-none">{colab.cargo}</td>
                                    <td className="text-center border-none">
                                        {colab.status_offboarding === 'Concluído' ? (
                                            <div className="badge border-none gap-2 text-white font-bold text-xs p-3 bg-emerald-600"><CheckCircle size={14} weight="fill" /> Concluído</div>
                                        ) : (
                                            <div className="badge border-none gap-2 text-gray-300 text-xs p-3 bg-gray-600"><Clock size={14} weight="fill" /> Pendente</div>
                                        )}
                                    </td>
                                    <td className="text-center text-sm text-gray-400 border-none">
                                        {colab.data_ultima_entrevista ? new Date(colab.data_ultima_entrevista).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                    <td className="text-center border-none">
                                        <div className="flex justify-center gap-1">
                                            <button onClick={() => abrirConfiguracaoLink(colab)} className="btn btn-sm btn-circle btn-ghost text-blue-400 hover:bg-gray-700 hover:text-blue-300 tooltip tooltip-left" data-tip="Gerar Link"><LinkIcon size={18} weight="bold" /></button>
                                            <button onClick={() => handleAbrirEdicao(colab)} className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:bg-gray-700 hover:text-white tooltip tooltip-left" data-tip="Editar"><PencilSimple size={18} /></button>
                                            <button onClick={() => handleAbrirDelete(colab)} className="btn btn-sm btn-circle btn-ghost text-red-400 hover:bg-red-900/30 hover:text-red-300 tooltip tooltip-left" data-tip="Excluir"><Trash size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {listaFinal.length === 0 && (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500 italic border-none">Nenhum colaborador encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>

      {/* MODAL CADASTRO (MANTIDO) */}
      {modalCadastroAberto && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box bg-gray-800 rounded-3xl p-8 max-w-2xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-2xl text-white">{editandoUsuario ? "Editar Colaborador" : "Cadastrar Colaborador"}</h3>
                <button onClick={() => setModalCadastroAberto(false)} className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <form onSubmit={handleSalvar} className="flex flex-col gap-4 font-corpo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label text-gray-300">Nome Completo</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" value={formData.nome_completo} onChange={e => setFormData({...formData, nome_completo: e.target.value})} />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Email Corporativo</label>
                        <input required type="email" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent disabled:bg-gray-800 disabled:text-gray-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={!!editandoUsuario} />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Departamento</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})} />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Cargo</label>
                        <input required type="text" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-accent" value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} />
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-300">Data de Entrada</label>
                        <input required type="date" className="input input-bordered rounded-xl bg-gray-700 border-gray-600 text-white scheme-dark focus:border-accent" value={formData.data_entrada} onChange={e => setFormData({...formData, data_entrada: e.target.value})} />
                    </div>
                </div>
                <div className="modal-action mt-8">
                    <button type="button" onClick={() => setModalCadastroAberto(false)} className="btn btn-ghost text-gray-400 hover:text-white hover:bg-gray-700">Cancelar</button>
                    <button type="submit" className="btn btn-accent text-gray-900 font-bold px-8 rounded-xl shadow-lg shadow-accent/20">{editandoUsuario ? "Salvar Alterações" : "Cadastrar Colaborador"}</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE (MANTIDO) */}
      {modalDeleteAberto && usuarioParaDeletar && (
        <div className="modal modal-open backdrop-blur-sm">
            <div className="modal-box bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
                <div className="flex flex-col items-center text-center gap-4">
                    <Warning size={48} className="text-red-500" />
                    <h3 className="font-title text-2xl text-white">Excluir Colaborador?</h3>
                    <p className="font-corpo text-gray-300"><strong>{usuarioParaDeletar.nome_completo}</strong> será removido.</p>
                    <div className="flex gap-4 mt-4 w-full">
                        <button onClick={() => setModalDeleteAberto(false)} className="btn btn-ghost flex-1 text-gray-400 hover:bg-gray-700 hover:text-white">Cancelar</button>
                        <button onClick={confirmarDelete} className="btn btn-error flex-1 text-white font-bold shadow-lg shadow-error/20">Sim, Excluir</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL CONFIGURAR LINK (MANTIDO) */}
      {modalConfigLinkAberto && selectedUser && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box bg-gray-800 rounded-3xl p-8 max-w-md shadow-2xl border border-gray-700 overflow-visible">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-xl text-white">Gerar Link</h3>
                <button onClick={() => setModalConfigLinkAberto(false)} className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <div className="mb-4"><p className="font-bold text-white">{selectedUser.nome_completo}</p></div>
            <div className="flex flex-col gap-4">
                <div className="form-control">
                    <span className="label-text font-bold text-gray-300 mb-2">Tipo de Saída</span>
                    <select className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-accent" value={configLink.tipo} onChange={(e) => setConfigLink({...configLink, tipo: e.target.value})}>
                        <option value="voluntaria">Voluntária (Pediu Demissão)</option>
                        <option value="involuntaria">Involuntária (Demitido)</option>
                    </select>
                </div>
                <div className="form-control">
                    <span className="label-text font-bold text-gray-300 mb-2">Era Líder?</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-300"><input type="radio" name="lider" className="radio radio-primary border-gray-500 checked:border-accent" checked={configLink.lider === 'true'} onChange={() => setConfigLink({...configLink, lider: 'true'})} /> Sim</label>
                        <label className="flex items-center gap-2 cursor-pointer text-gray-300"><input type="radio" name="lider" className="radio radio-primary border-gray-500 checked:border-accent" checked={configLink.lider === 'false'} onChange={() => setConfigLink({...configLink, lider: 'false'})} /> Não</label>
                    </div>
                </div>
                <button onClick={handleGerarLinkFinal} className="btn btn-accent w-full mt-4 rounded-xl text-gray-900 font-bold shadow-lg shadow-accent/20"><PaperPlaneTilt size={20} weight="bold" /> Gerar Link</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LINK GERADO (VISUAL AJUSTADO) */}
      {modalLinkAberto && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
            <h3 className="font-title text-2xl text-white mb-2">Link Gerado! 🚀</h3>
            <div className="bg-gray-900 p-4 rounded-xl flex items-center gap-2 border border-gray-700 my-4">
                <code className="text-sm break-all text-emerald-400 font-mono w-full">{linkGerado}</code>
                <button onClick={copyToClipboard} className={`btn btn-square btn-sm ${copiado ? 'btn-success text-white' : 'btn-ghost text-gray-400 hover:text-white'}`}>{copiado ? <Check size={20} className="text-white"/> : <Copy size={20} />}</button>
            </div>
            {/* BOTÃO CONCLUÍDO COM CORREÇÃO VISUAL */}
            <button 
                onClick={() => setModalLinkAberto(false)} 
                className="btn btn-accent rounded-xl w-full text-gray-900 font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] transition-transform"
            >
                Concluído
            </button>
          </div>
        </div>
      )}
    </div>
  );
}