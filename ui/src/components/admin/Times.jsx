import { Squircle } from "corner-smoothing"
import { CaretDownIcon, DotsThreeIcon, EyeglassesIcon, LightbulbIcon, LinkIcon, PencilIcon, PlusIcon, UserListIcon, UsersThreeIcon } from "@phosphor-icons/react";

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

    const objTime = {
        nomeTime: "Time 1",
        valorScore: 0.5,
        valorInten: 0.75,
    }

    return (
        <div className="md:pr-2 pr-7">
            <h1 className="text-primary font-title text-4xl text-center my-[2vh]">Departamento</h1>
            <div className="flex md:flex-row flex-col flex-wrap gap-3">    
                <Squircle className="bg-secondary/30 md:w-[30vw] w-full h-70 px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                    <h2 className="font-title text-primary text-2xl text-center mt-[1vw]">{objTime.nomeTime}</h2>
                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="w-full h-10 bg-secondary/60 rounded-xl"> 
                                <div className="h-full rounded-xl" style={{ 
                                    width: `calc(${objTime.valorScore} * 100%)`, 
                                    backgroundColor: `${getBgClass(objTime.valorScore)}` 
                                    }} />
                                <p className="text-primary text-center font-corpo text-xs mt-[-1.8rem]">{objTime.valorScore}</p>
                            </div>
                            <p className="text-primary text-center font-corpo text-sm">Score Médio</p>
                        </div>
                        <Squircle className="bg-secondary/30 w-full h-15 px-[1vw] py-[1vh] flex gap-[.5vw]" cornerRadius={20} cornerSmoothing={1}>
                            <LightbulbIcon size="full" weight="thin" className="my-auto text-primary w-7" />
                            <p className="font-corpo text-xs my-auto">Dica: Considere conversar com a liderança do time e entender o que pode ser melhorado</p>
                        </Squircle>
                    </div>
                    <Squircle onClick={() => {document.getElementById('modalTimes').showModal()}} cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-50 h-[7vh] justify-center mt-[2vh] mx-auto">
                        <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                        <p className="text-primary text-md font-corpo my-auto">Detalhes</p>
                    </Squircle>
                </Squircle>
            </div>

             <dialog id="modalTimes" className="modal">
                        <div className="modal-box max-w-90/100 ">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                        </form>
                        <div className="flex mt-[1vh]">
                            <div className="flex gap-[1vw] w-full">
                                <h1 className="font-title text-xl text-primary">Time 1</h1>
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
                                    <input type="radio" name="my_tabs_3" class="tab" aria-label="(ex)Colaboradores"/>
                                    <UserListIcon size="4vh" weight="thin" className="my-auto" />
                                    (ex)Colaboradores
                                </label>
                                <div class="tab-content bg-secondary/10 border-secondary/50 p-6">
                                    <h2 className="text-[1.5vw] font-title">(ex)Colaboradores</h2>
                                    <div className="flex flex-row gap-[1vh] w-full mt-[2vh]">
                                        <label for="pesquisar" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary my-auto">Pesquisar</label>
                                        <input name="pesquisar" type="text" id="pesquisar" placeholder="Pesquisar" className="bg-secondary/30 p-[2vh] md:mx-0 w-full h-[7vh] md:w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                                    </div>
                                    <table className="table table-zebra font-corpo mt-[2vh] border-separate">
                                        <thead>
                                            <tr>
                                                <th>Colaborador</th>
                                                <th>Time</th>
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
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <label className="tab flex gap-[.5vw] border-secondary/50 border-b-0">
                                    <input type="radio" name="my_tabs_3" class="tab" aria-label="Times" />
                                    <UsersThreeIcon size="4vh" weight="thin" className="my-auto" />
                                    Times
                                </label>
                                <div class="tab-content bg-secondary/10 border-secondary/50 p-6">
                                    <div className="flex flex-wrap gap-[1vw]">
                                        <Squircle className="bg-secondary/30 w-[19vw] h-[25vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                                            <h2 className="font-title text-primary text-[1.7vw] text-center mt-[1vw]">Time 1</h2>
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
                                            </div>
                                        </Squircle>       
                                    </div>                     
                                </div>
                            </div>
                        </div>
                        </div>
             </dialog>
        </div>
    )
}