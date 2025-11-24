import { Squircle } from "corner-smoothing"
import { CaretDownIcon, DotsThreeIcon, EyeglassesIcon, LinkIcon, PencilIcon, PlusIcon } from "@phosphor-icons/react";
import RespostaViewUsr from "./RespostaViewUsr";

export default () => {

    const getBgClass = (valor) => {
        if (valor > 0.9) return "#277CDD";
        if (valor >= 0.75) return "#22B457";
        if (valor >= 0.6) return "#2DB61E";
        if (valor >= 0.4) return "#DDB927";
        if (valor >= 0.25) return "#FF3939";
        if (valor >= 0.1) return "#5F1D1D";
        return "#1E1E1E";
    };

    async function copyTextToClipboard(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            console.log('Texto copiado com sucesso');
        } catch (err) {
            console.error('Falha ao copiar: ', err);
        }
    }


    return(
        <div>
            <h1 className="text-primary font-title text-[2.5vw] text-center my-[2vh]">Colaboradores</h1>
            <div className="flex gap-[1vw] mr-[1vw]">
                <Squircle cornerRadius={20} cornerSmoothing={1} className="flex justify-center items-center bg-secondary/30 w-full h-[30vh] stat">
                    <p className="font-corpo text-primary text-[2vw] text-center">xx% respondido</p>
                </Squircle>

                <Squircle cornerRadius={20} cornerSmoothing={1} className="flex justify-center items-center bg-secondary/30 w-full h-[30vh]">
                    <p className="font-corpo text-primary text-[2vw] text-center">xx% não respondido</p>
                </Squircle>
            </div>
            <div>
                <h2 className="text-primary font-title text-[2vw] my-[2vh]">(ex)Colaboradores</h2>
                <div className="flex mr-[1vw] gap-[5vw]">
                    <div className="flex flex-row gap-[1vh] w-full">
                        <label for="pesquisar" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary my-auto">Pesquisar</label>
                        <input name="pesquisar" type="text" id="pesquisar" placeholder="Pesquisar" className="bg-secondary/30 p-[2vh] md:mx-0 w-full h-[7vh] md:w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                    </div>
                    <div>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center">
                            <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Adicionar</p>
                        </Squircle>
                    </div>
                </div>
                <table className="table table-zebra font-corpo mt-[2vh] border-separate">
                    <thead>
                        <tr>
                            <th>Colaborador</th>
                            <th>Time</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-secondary/40">
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                    <div class="mask mask-squircle h-12 w-12">
                                        <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"/>
                                    </div>
                                    </div>
                                    <div>
                                    <div class="font-bold">João da Silva</div>
                                    <div class="text-sm opacity-50">Função</div>
                                    </div>
                                    <div className="w-[12.5vw] h-[6vh] bg-secondary/60 rounded-xl"> 
                                        <div className="h-full rounded-xl" style={{ 
                                            width: `calc(0.5 * 12.5vw)`, 
                                            backgroundColor: `${getBgClass(0.5)}` 
                                        }} />
                                        <p className="text-primary text-center font-light text-[1vw] mt-[-4.5vh]">0.5</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge badge-ghost badge-sm">Time</span>
                            </td>
                            <td>
                                <div className="flex gap-[1vw]">
                                    <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[6vh] justify-center" onClick={() => copyTextToClipboard("www.google.com")}>
                                        <LinkIcon size="4vh" weight="thin" className="my-auto" />
                                        <p className="text-primary font-corpo my-auto font-light">Copiar Link</p>
                                    </Squircle>
                                    <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[6vh] justify-center" onClick={() => {document.getElementById('modalDetalhes').showModal()}}>
                                        <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                                        <p className="text-primary font-corpo my-auto font-light">Detalhes</p>
                                    </Squircle>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <dialog id="modalDetalhes" className="modal">
                <div className="modal-box max-w-90/100 ">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                </form>
                <div className="flex">
                    <div className="flex gap-[1vw] w-full">
                        <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" class="mask mask-squircle w-[8vw] h-[8vw] object-cover"/>
                        <div className="flex flex-col my-auto">
                            <h1 className="font-title md:text-[2vw] text-[6vw] text-primary">Nome Funcionário</h1>
                            <p className="font-corpo md:text-[1vw] text-[4vw] text-primary">Time</p> 
                        </div>
                    </div>
                    <div className="h-[6vh] bg-secondary/60 rounded-xl my-auto w-full"> 
                        <div className="h-full rounded-xl" style={{ 
                            width: `calc(0.5 * 100%)`, 
                            backgroundColor: `${getBgClass(0.5)}` 
                        }} />
                        <p className="text-primary text-center font-light font-corpo text-[1vw] mt-[-4.5vh]">0.5</p>
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
                            <div className="flex flex-wrap gap-[1vw]">
                                <Squircle className="bg-secondary/30 w-[19vw] h-[35vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                                    <h2 className="font-title text-primary text-[1.7vw] text-center mt-[1vw]">Salário e Benefícios</h2>
                                    <div className="flex flex-col gap-[1vw]">
                                        <div>
                                            <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl mx-auto"> 
                                                <div className="h-full rounded-xl" style={{ 
                                                    width: `calc(${0.5} * 12.5vw)`, 
                                                    backgroundColor: `${getBgClass(0.5)}` 
                                                    }} />
                                                <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{0.5}</p>
                                            </div>
                                            <p className="text-primary text-center font-corpo text-[1vw]">Score Médio</p>
                                        </div>
                                        <div>
                                            <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl mx-auto"> 
                                                <div className="h-full rounded-xl" style={{ 
                                                    width: `calc(${0.5} * 12.5vw)`, 
                                                    backgroundColor: `${getBgClass(0.5)}`
                                                }} />
                                                <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{0.5}</p>
                                            </div>
                                            <p className="text-primary text-center font-corpo text-[1vw]">Intensidade Média</p>
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
                        <div class="tab-content bg-secondary/10 border-secondary/50 p-6">
                            <h2 className="text-[1.5vw] font-title">Categoria</h2>
                            <RespostaViewUsr />
                            <RespostaViewUsr />
                        </div>
                    </div>
                </div>
                </div>
            </dialog>
           
        </div>
    )
}