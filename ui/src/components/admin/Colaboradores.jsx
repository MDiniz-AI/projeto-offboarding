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
  ShieldCheck,
  CaretDown,
  User
} from '@phosphor-icons/react';
import api from '../../lib/api';

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  
  // --- ESTADOS DE CONTROLE ---
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalConfigLinkAberto, setModalConfigLinkAberto] = useState(false); 
  const [modalLinkAberto, setModalLinkAberto] = useState(false);
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  
  // Estados de Ação
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null); 

  // Estados de Link
  const [selectedUser, setSelectedUser] = useState(null); 
  const [configLink, setConfigLink] = useState({ tipo: 'voluntaria', lider: 'false' });
  const [linkGerado, setLinkGerado] = useState("");
  const [usuarioLink, setUsuarioLink] = useState("");
  const [copiado, setCopiado] = useState(false);

  // Formulário
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

  // --- 1. CARREGAR DADOS ---
  async function fetchColaboradores() {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      console.log("👥 Colaboradores carregados:", response.data);
      setColaboradores(response.data);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchColaboradores();
  }, []);

  // --- 2. EDIÇÃO ---
  function handleAbrirEdicao(colab) {
      console.log("✏️ Editando usuário:", colab);
      setEditandoUsuario(colab);
      setFormData({
          nome_completo: colab.nome_completo || "",
          email: colab.email || "",
          departamento: colab.departamento || "",
          cargo: colab.cargo || "",
          data_entrada: colab.data_entrada ? String(colab.data_entrada).split('T')[0] : "", 
          password: "",
          admin: Boolean(colab.admin) 
      });
      setModalCadastroAberto(true);
  }

  function handleAbrirCadastro() {
      setEditandoUsuario(null);
      setFormData(initialFormState);
      setModalCadastroAberto(true);
  }

  // --- 3. SALVAR (POST/PUT) ---
  async function handleSalvar(e) {
    e.preventDefault();
    try {
      if (editandoUsuario) {
          // UPDATE
          const id = editandoUsuario.usuario_id || editandoUsuario.id;
          const payload = { ...formData };
          if (!payload.password) delete payload.password; 

          await api.put(`/usuarios/${id}`, payload);
          alert("Colaborador atualizado com sucesso!");

      } else {
          // CREATE
          const payload = {
            ...formData,
            password: formData.password || "blip123",
            motivo_saida: "N/A", 
            data_saida: null
          };
          await api.post('/usuarios', payload);
          alert("Colaborador cadastrado com sucesso!");
      }

      setModalCadastroAberto(false);
      setFormData(initialFormState);
      fetchColaboradores(); 

    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      const msg = error.response?.data?.error || "Erro desconhecido ao salvar.";
      const details = error.response?.data?.details || "";
      alert(`Erro: ${msg} \n${details}`);
    }
  }

  // --- 4. EXCLUSÃO ---
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
          const msg = error.response?.data?.error || "Erro ao excluir.";
          alert(`Não foi possível excluir: ${msg}`);
      }
  }

  // --- 5. GERAÇÃO DE LINKS ---
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

  // --- FILTROS ---
  const colaboradoresFiltrados = colaboradores.filter(c => 
    (c.nome_completo?.toLowerCase() || "").includes(busca.toLowerCase()) ||
    (c.email?.toLowerCase() || "").includes(busca.toLowerCase())
  );

  // Separação em dois grupos
  const listaAdmins = colaboradoresFiltrados.filter(c => c.admin);
  const listaColaboradores = colaboradoresFiltrados.filter(c => !c.admin);

  // Componente interno para Renderizar Tabela (Reutilizável)
  const TabelaUsuarios = ({ dados }) => (
    <div className="overflow-x-auto rounded-xl">
        <table className="table table-zebra table-fixed w-full">
            <thead className="text-primary font-title text-lg border-b border-primary/10">
                <tr>
                    <th className="w-[30%] bg-white/90 backdrop-blur-md">Nome</th>
                    <th className="w-[25%] bg-white/90 backdrop-blur-md">Cargo / Depto</th>
                    <th className="w-[25%] bg-white/90 backdrop-blur-md">Email</th>
                    <th className="w-[20%] text-center bg-white/90 backdrop-blur-md">Ações</th>
                </tr>
            </thead>
            <tbody className="font-corpo text-primary/80">
                {dados.map((colab) => (
                    <tr key={colab.usuario_id || colab.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="truncate">
                            <div className="flex items-center gap-2" title={colab.nome_completo}>
                                <span className="font-bold truncate block">{colab.nome_completo}</span>
                                {colab.admin && (
                                    <div className="tooltip tooltip-right flex-shrink-0" data-tip="Administrador">
                                        <ShieldCheck size={18} className="text-accent" weight="fill" />
                                    </div>
                                )}
                            </div>
                        </td>
                        <td className="truncate">
                            <div className="flex flex-col truncate">
                                <span className="font-bold text-xs truncate" title={colab.cargo}>{colab.cargo}</span>
                                <span className="text-xs opacity-70 truncate" title={colab.departamento}>{colab.departamento}</span>
                            </div>
                        </td>
                        <td className="text-sm truncate" title={colab.email}>
                            {colab.email}
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
                                    data-tip="Editar Usuário"
                                >
                                    <PencilSimple size={20} />
                                </button>
                                <button 
                                    onClick={() => handleAbrirDelete(colab)}
                                    className="btn btn-sm btn-circle btn-ghost text-error/70 hover:text-error tooltip tooltip-left"
                                    data-tip="Excluir Usuário"
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {dados.length === 0 && (
                    <tr>
                        <td colSpan="4" className="text-center py-4 text-primary/50 italic">
                            Nenhum usuário encontrado nesta categoria.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-primary font-title text-4xl">Gestão de Colaboradores</h1>
            <p className="text-primary/60 font-corpo text-sm mt-1">Gerencie quem terá acesso ao formulário de offboarding.</p>
        </div>
        <button 
            onClick={handleAbrirCadastro} 
            className="btn btn-accent text-primary font-corpo rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap"
        >
            <UserPlus size={24} />
            Novo Colaborador
        </button>
      </div>

      {/* Busca */}
      <div className="relative w-full md:w-1/3">
        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
        <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            className="input input-bordered w-full pl-10 bg-secondary/10 border-none rounded-xl text-primary placeholder-primary/50 focus:outline-accent"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Área de Conteúdo Scrollável */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        {loading ? (
            <div className="flex justify-center items-center h-40 text-primary">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        ) : (
            <>
                {/* TABELA 1: ADMINISTRADORES */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={24} className="text-accent" weight="fill" />
                        <h2 className="text-xl font-bold text-primary font-title">Administradores</h2>
                        <span className="badge badge-ghost text-xs font-bold">{listaAdmins.length}</span>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden border border-white/20 p-4">
                        <TabelaUsuarios dados={listaAdmins} />
                    </div>
                </section>

                {/* TABELA 2: COLABORADORES */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <User size={24} className="text-primary/70" weight="bold" />
                        <h2 className="text-xl font-bold text-primary font-title">Colaboradores (Acesso Formulário)</h2>
                        <span className="badge badge-ghost text-xs font-bold">{listaColaboradores.length}</span>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden border border-white/20 p-4">
                        <TabelaUsuarios dados={listaColaboradores} />
                    </div>
                </section>
            </>
        )}
      </div>

      {/* --- MODAIS (Permanecem iguais) --- */}

      {/* MODAL CADASTRO/EDIÇÃO */}
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
                        <label className="label text-primary">Senha {editandoUsuario ? "(Vazio = Manter atual)" : "(Opcional)"}</label>
                        <input type="password" placeholder={editandoUsuario ? "******" : "Padrão: blip123"} className="input input-bordered rounded-xl bg-secondary/10" 
                             value={formData.password} 
                             onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="form-control mt-2 bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                    <label className="label cursor-pointer justify-start gap-4 p-0">
                        <input 
                            type="checkbox" 
                            className="toggle toggle-accent" 
                            checked={formData.admin}
                            onChange={(e) => setFormData({...formData, admin: e.target.checked})}
                        />
                        <span className="label-text text-primary font-bold flex items-center gap-2">
                            <ShieldCheck size={20} weight={formData.admin ? "fill" : "regular"} />
                            Acesso de Administrador
                        </span>
                    </label>
                    <span className="text-xs text-primary/60 mt-2 pl-14">
                        Habilita acesso a este painel de gestão de usuários.
                    </span>
                </div>

                <div className="modal-action mt-8">
                    <button type="button" onClick={() => setModalCadastroAberto(false)} className="btn btn-ghost text-primary/70">Cancelar</button>
                    <button type="submit" className="btn btn-accent text-primary px-8 rounded-xl">
                        {editandoUsuario ? "Salvar Alterações" : "Cadastrar"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modalDeleteAberto && usuarioParaDeletar && (
        <div className="modal modal-open">
            <div className="modal-box bg-base-100 rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-error/10 p-4 rounded-full">
                        <Warning size={48} className="text-error" />
                    </div>
                    <h3 className="font-title text-2xl text-primary">Excluir Colaborador?</h3>
                    <p className="font-corpo text-primary/70">
                        Tem certeza que deseja remover <strong>{usuarioParaDeletar.nome_completo}</strong>? <br/>
                        Esta ação não pode ser desfeita.
                    </p>
                    
                    <div className="flex gap-4 mt-4 w-full">
                        <button onClick={() => setModalDeleteAberto(false)} className="btn btn-ghost flex-1">Cancelar</button>
                        <button onClick={confirmarDelete} className="btn btn-error flex-1 text-white">Sim, Excluir</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL CONFIGURAR FORMULÁRIO */}
      {modalConfigLinkAberto && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 rounded-3xl p-8 max-w-md shadow-2xl border border-white/20 overflow-visible">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-title text-xl text-primary">Configurar Formulário</h3>
                <button onClick={() => setModalConfigLinkAberto(false)} className="btn btn-sm btn-circle btn-ghost text-primary"><X size={24}/></button>
            </div>
            
            <div className="mb-6 border-b border-primary/10 pb-4">
                <p className="text-sm text-primary/60">Gerar link para:</p>
                <p className="font-title text-2xl text-primary mt-1">{selectedUser.nome_completo}</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="form-control">
                    <span className="label-text font-bold text-primary text-md mb-2 block">Tipo de Saída:</span>
                    <div className="dropdown dropdown-bottom w-full">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="btn w-full justify-between bg-base-200 text-primary font-normal border-none hover:bg-base-300 no-animation"
                        >
                            {configLink.tipo === 'voluntaria' ? 'Voluntária (Pediu Demissão)' : 'Involuntária (Demitido)'}
                            <CaretDown size={16} weight="bold" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[999] menu p-2 shadow-xl bg-base-100 rounded-box w-full mt-1 border border-primary/10">
                            <li>
                                <a 
                                    className={configLink.tipo === 'voluntaria' ? 'active font-bold' : ''}
                                    onClick={() => {
                                        setConfigLink({...configLink, tipo: 'voluntaria'});
                                        document.activeElement.blur();
                                    }}
                                >
                                    Voluntária (Pediu Demissão)
                                </a>
                            </li>
                            <li>
                                <a 
                                    className={configLink.tipo === 'involuntaria' ? 'active font-bold' : ''}
                                    onClick={() => {
                                        setConfigLink({...configLink, tipo: 'involuntaria'});
                                        document.activeElement.blur();
                                    }}
                                >
                                    Involuntária (Demitido)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="form-control">
                    <label className="label cursor-pointer flex-row items-center justify-between">
                        <span className="label-text font-bold text-primary text-md">Cargo de Líder?</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="lider" 
                                    className="radio radio-primary radio-sm" 
                                    checked={configLink.lider === 'true'} 
                                    onChange={() => setConfigLink({...configLink, lider: 'true'})} 
                                />
                                <span className="text-sm">Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="lider" 
                                    className="radio radio-primary radio-sm" 
                                    checked={configLink.lider === 'false'} 
                                    onChange={() => setConfigLink({...configLink, lider: 'false'})} 
                                />
                                <span className="text-sm">Não</span>
                            </label>
                        </div>
                    </label>
                </div>
                
                <button onClick={handleGerarLinkFinal} className="btn btn-accent w-full mt-4 rounded-xl text-primary font-bold shadow-md">
                    <PaperPlaneTilt size={20} weight="bold" /> Gerar Link
                </button>
            </div>
          </div>
        </div>
      )}

      {modalLinkAberto && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 rounded-3xl p-8 shadow-2xl border border-white/20">
            <h3 className="font-title text-2xl text-primary mb-2">Link Gerado! 🚀</h3>
            <p className="text-primary/70 font-corpo mb-6">Link para <strong>{usuarioLink}</strong> (48h validade).</p>
            <div className="bg-secondary/10 p-4 rounded-xl flex items-center gap-2 border border-secondary/20">
                <code className="text-sm break-all text-primary font-mono bg-transparent w-full">{linkGerado}</code>
                <button onClick={copyToClipboard} className={`btn btn-square btn-sm ${copiado ? 'btn-success' : 'btn-ghost'} transition-all`}>
                    {copiado ? <Check size={20} className="text-white"/> : <Copy size={20} className="text-primary"/>}
                </button>
            </div>
            <div className="modal-action mt-6"><button onClick={() => setModalLinkAberto(false)} className="btn btn-primary rounded-xl w-full">Concluído</button></div>
          </div>
        </div>
      )}
    </div>
  );
}