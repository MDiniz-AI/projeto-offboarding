import { Squircle } from "corner-smoothing"
import { CaretDownIcon, DotsThreeIcon, EyeglassesIcon, LinkIcon, PencilIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import RespostaViewUsr from "./RespostaViewUsr";
import api from "../../lib/api";
import sha256 from 'crypto-js/sha256';

export default () => {

    const usuarioFake = {
        id_usuario: 1,
        nome_completo: "Usuário Exemplo",
        cargo: "Cargo Teste",
        departamento: "TI",
        email: "teste@teste.com.br",
        data_entrada: "2024-01-01",
        data_saida: "2024-12-31"
    };

    const getBgClass = (valor) => {
    if (valor >= 0.75) return "progress-success";
    if (valor >= 0.25) return "progress-warning";
    return "progress-error";
  };

    async function copyTextToClipboard(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            console.log('Texto copiado com sucesso');
        } catch (err) {
            console.error('Falha ao copiar: ', err);
        }
    }

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const formatter = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });


    async function carregarUsuarios() {
    try {
      const response = await api.get("/usuarios/users");
      setUsuarios(response.data);
      setUsuariosFiltrados(response.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    useEffect(() => {
  
  setUsuarios([usuarioFake]);
  setUsuariosFiltrados([usuarioFake]);
}, []);


  useEffect(() => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const filtrados = usuarios.filter((usuario) => {
      
      const nome = (usuario.nome_completo || "").toLowerCase();
      const cargo = (usuario.cargo || "").toLowerCase();
      const departamento = (usuario.departamento || "").toLowerCase();

      return (
        nome.includes(termo) ||
        cargo.includes(termo) ||
        departamento.includes(termo)
      );
    });

    setUsuariosFiltrados(filtrados);
  }, [usuarios, pesquisa]);

    
function filtrarUsuarios(texto) {
    setPesquisa(texto);
  
  }
  async function gerarLink(usuario) {
  try {
    const payload = {
      nome: usuario.nome_completo,
      email: usuario.email
    };

    const response = await api.post("/auth/gerar-link", payload);

    const link = response.data.link;

    // copia o link para a área de transferência
    await copyTextToClipboard(link);

    alert("Link copiado para a área de transferência!");

  } catch (error) {
    console.error("Erro ao gerar link:", error);
    alert("Erro ao gerar link. Veja o console.");
  }
}

    return(
        <div className="md:pr-0 pr-5">
            <h1 className="text-primary font-title text-4xl text-center my-[2vh]">Colaboradores</h1>
            <div className="flex md:flex-row flex-col gap-[1vw] mr-[1vw]">
                <Squircle cornerRadius={20} cornerSmoothing={1} className="flex justify-center items-center bg-secondary/30 w-full md:h-[30vh] h-30">
                    <p className="font-corpo text-primary text-2xl text-center">xx% respondido</p>
                </Squircle>

                <Squircle cornerRadius={20} cornerSmoothing={1} className="flex justify-center items-center bg-secondary/30 w-full md:h-[30vh] h-30">
                    <p className="font-corpo text-primary text-2xl text-center">xx% não respondido</p>
                </Squircle>
            </div>
            <div>
                <h2 className="text-primary font-title text-2xl my-[2vh]">(ex)Colaboradores</h2>
                <div className="flex md:flex-row flex-col mr-[1vw] gap-[5vw]">
                    <div className="flex md:flex-row flex-col gap-[1vh] w-full">
                        <label for="pesquisar" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary my-auto">Pesquisar</label>
                        <input name="pesquisar" type="text" id="pesquisar" placeholder="Pesquisar" value={pesquisa}  onChange={(e) => filtrarUsuarios(e.target.value)} className="bg-secondary/30 p-[2vh] md:mx-0 w-full h-[7vh] md:w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                    </div>
                    <div>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex md:mx-0 mx-auto bg-secondary/50 md:w-[10vw] w-50 h-[7vh] justify-center" onClick={() => {document.getElementById('modalCadastro').showModal()}}>
                            <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Adicionar</p>
                        </Squircle>
                    </div>
                </div>
                <table className="table table-zebra font-corpo mt-[2vh] border-separate">
                    <thead>
                        <tr>
                            <th>Colaborador</th>
                            <th>Departamento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                                {usuariosFiltrados.map((u) => (
                                    <tr key={u.id_usuario} className="hover:bg-secondary/40">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img src={`https://gravatar.com/avatar/${sha256(u.email)}?s=50`} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold">{u.nome_completo}</div>
                                                    <div className="text-sm opacity-50">{u.cargo || "Função"}</div>
                                                </div>

                                                {/* Score fictício por enquanto */}
                                                
                                                <div className="relative w-[12vw]"> 
                                                        <progress class={`progress md:w-full w-39 h-[5vh] ${getBgClass(0.5)}`} value={0.5 * 100} max="100">0.5</progress>
                                                        <span className="absolute inset-0 flex items-center justify-center text-sm font-corpo text-primary">{0.5}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="badge badge-ghost badge-sm">{u.departamento || "Departamento"}</span>
                                        </td>

                                        <td>
                                            <div className="flex gap-[1vw]">
                                                
                                                <Squircle 
                                                    cornerRadius={10}
                                                    cornerSmoothing={1}
                                                    className="flex bg-secondary/50 w-[10vw] h-[6vh] justify-center"
                                                    onClick={() => gerarLink(u)}
                                                >
                                                    <LinkIcon size="4vh" weight="thin" className="my-auto" />
                                                    <p className="text-primary font-corpo my-auto font-light">Copiar Link</p>
                                                </Squircle>

                                                <Squircle 
                                                    cornerRadius={10}
                                                    cornerSmoothing={1}
                                                    className="flex bg-secondary/50 w-[10vw] h-[6vh] justify-center"
                                                    onClick={() => {
                                                        setUsuarioSelecionado(u);
                                                        document.getElementById('modalDetalhes').showModal();
                                                    }}
                                                >
                                                    <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                                                    <p className="text-primary font-corpo my-auto font-light">Detalhes</p>
                                                </Squircle>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {usuarioSelecionado && (

                        <dialog id="modalDetalhes" className="modal">
                            <div className="modal-box max-w-90/100 ">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                            </form>
                            <div className="flex">
                                <div className="flex gap-[1vw] w-full">
                                    {/* <img src="https://i.pravatar.cc/150?u=${usuarioSelecionado.email}" class="mask mask-squircle w-[8vw] h-[8vw] object-cover"/> */}
                                    <img src={`https://gravatar.com/avatar/${sha256(usuarioSelecionado.email)}?s=200`} class="mask mask-squircle w-[8vw] h-[8vw] object-cover"/>
                                    <div className="flex flex-col my-auto">
                                        <h1 className="font-title md:text-[2vw] text-[6vw] text-primary">{usuarioSelecionado.nome_completo}</h1>
                                        <p className="font-corpo md:text-[1vw] text-[4vw] text-primary">{usuarioSelecionado.departamento || "Departamento"}</p> 
                                        <p className="font-corpo md:text-[1vw] text-[4vw] text-primary">{usuarioSelecionado.cargo || "Cargo"}</p> 
                                        <p className="font-corpo md:text-[1vw] text-[4vw] text-primary"> Data de Entrada:
                                        {formatter.format(new Date(usuarioSelecionado.data_entrada)) || "Data de entrada"}
                                        </p> 
                                        <p className="font-corpo md:text-[1vw] text-[4vw] text-primary"> Data de Saída:
                                            {formatter.format(new Date(usuarioSelecionado.data_saida)) || "Data de saída"}
                                        </p> 
                                        
                                    </div>
                                </div>
                                <div className="relative h-[6vh] my-auto w-full"> 
                                    <progress class={`progress md:w-full w-39 h-[5vh] ${getBgClass(0.5)}`} value={0.5 * 100} max="100">0.5</progress>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-corpo text-primary">{0.5}</span>
                                </div>
                            </div>

                            <div className="mt-[2vh]">
                                <div class="tabs tabs-lift">
                                    <label className="tab flex gap-[.5vw] border-secondary/50 border-b-0">
                                        <input type="radio" name="my_tabs_3" class="tab" aria-label="Visão Geral" />
                                        <EyeglassesIcon size="4vh" weight="thin" className="my-auto" />
                                        Visão Geral
                                    </label>
                                    <div class="tab-content bg-secondary/10 border-secondary/50 p-6">
                                        <div className="flex md:flex-row flex-col flex-wrap gap-[1vw]">
                                            <Squircle className="bg-secondary/30 md:w-[19vw] w-screen h-[35vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                                                <h2 className="font-title text-primary text-2xl text-center mt-[1vw]">Salário e Benefícios</h2>
                                                <div className="flex flex-col gap-[1vw]">
                                                    <div>
                                                        <div className="relative h-[7vh] my-auto w-[16vw]"> 
                                                            <progress class={`progress md:w-full w-39 h-full ${getBgClass(0.5)}`} value={0.5 * 100} max="100">0.5</progress>
                                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-corpo text-primary">{0.5}</span>
                                                        </div>
                                                        <p className="text-primary text-center font-corpo text-md">Score Médio</p>
                                                    </div>
                                                    <div>
                                                        <div className="relative h-[7vh] my-auto w-[16vw]"> 
                                                            <progress class={`progress md:w-full w-39 h-full ${getBgClass(0.5)}`} value={0.5 * 100} max="100">0.5</progress>
                                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-corpo text-primary">{0.5}</span>
                                                        </div>
                                                        <p className="text-primary text-center font-corpo text-md">Intensidade Média</p>
                                                    </div>
                                                </div>
                                            </Squircle>       
                                        </div>                     
                                    </div>

                                    <label className="tab flex gap-[.5vw] border-secondary/50 border-b-0">
                                        <input type="radio" name="my_tabs_3" class="tab" aria-label="Respostas"/>
                                        <PencilIcon size="4vh" weight="thin" className="my-auto" />
                                        Respostas
                                    </label>
                                    <div class="tab-content bg-secondary/10 border-secondary/50 p-7">
                                        <h2 className="text-[1.5vw] font-title">Categoria:</h2>
                                        <RespostaViewUsr emailUsuario={usuarioSelecionado.email} />
                                        
                                    </div>
                                </div>
                            </div>
                            </div>
                        </dialog>
            )}      

            <dialog id="modalCadastro" class="modal">
                <form method="dialog" class="modal-box max-w-lg">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                    </form>
                    
                    <h3 class="text-3xl mb-4 font-title">Cadastro de Funcionário</h3>

                    <div class="form-control mb-3">
                    <label class="label"><span class="label-text font-corpo text-primary/80">Nome completo</span></label>
                    <input type="text" class="input input-secondary w-full font-corpo text-primary/80" />
                    </div>

                    <div class="form-control mb-3">
                    <label class="label"><span class="label-text font-corpo text-primary/80">Email</span></label>
                    <input type="email" class="input input-secondary w-full font-corpo text-primary/80" />
                    </div>

                    <div class="form-control mb-3">
                    <label class="label"><span class="label-text font-corpo text-primary/80">Departamento</span></label>
                    <select name="depto" id="depto" className="select w-full select-secondary font-corpo">
                        <option key={1} value="Nenhum" disabled hidden selected="selected">Selecione uma opção</option>
                        {/*Aplicar o map de funcionarios existentes como opções**/}
                    </select>
                    </div>

                    <div class="form-control mb-3">
                    <label class="label"><span class="label-text font-corpo text-primary/80">Cargo</span></label>
                    <input type="text" class="input input-secondary w-full font-corpo text-primary/80" />
                    </div>

                    <div class="form-control mb-3">
                    <label class="label"><span class="label-text font-corpo text-primary/80">Data de entrada</span></label>
                    <input type="date" class="input input-secondary w-full font-corpo text-primary/80" />
                    </div>

                    <div class="form-control mb-4">
                    <label class="label"><span class="label-text font-corpo text-primary/80">Data de saída</span></label>
                    <input type="date" class="input input-secondary w-full font-corpo text-primary/80" />
                    </div>

                    <div class="modal-action">
                    <button class="btn text-primary/80">Cancelar</button>
                    <button class="btn btn-secondary text-primary/80">Salvar</button>
                    </div>
                </form>
            </dialog>


        </div>
    )
}