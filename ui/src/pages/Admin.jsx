import BlocoPrincipalAdm from "../components/BlocoPrincipalAdm.jsx"
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Squircle } from "corner-smoothing"; 
import { CaretDownIcon, DotsThreeIcon, PlusIcon } from "@phosphor-icons/react";
import InputCurto from "../components/InputCurto.jsx"
import InputLongo from "../components/InputLongo.jsx"
import Seletor from "../components/Seletor.jsx"


export const Contexto = createContext();

export default() => {
    const [searchParams, setSearchParams] = useSearchParams();
    let secaoQuery = Number(searchParams.get("pag") == null ? null : searchParams.get("pag"));
    if (secaoQuery == null || isNaN(secaoQuery) || secaoQuery < 1 || secaoQuery > 0) secaoQuery = 0

    const [pagAtual, setPagAtual] = useState(secaoQuery);

    // verifica a página atual pela query
    useEffect(() => {
        let novaSecao = Number(searchParams.get("pag"));
        if (novaSecao == null || isNaN(secaoQuery) || secaoQuery > 9 || secaoQuery < 2) secaoQuery = 2
        setPagAtual(novaSecao ?? 0);
    }, [searchParams]);

    return (
        <Contexto.Provider value={{pagAtual}}>
            <App />
        </Contexto.Provider>
    )

    function App(){
        
        const { pagAtual } = useContext(Contexto);
        const [tipoCampo, setTipoCampo] = useState("");
        const [opcoes, setOpcoes] = useState([""]);

        function adicionarOpcao() {
            setOpcoes((prev) => [...prev, ""]); // adiciona mais um vazio
        }

        const [abertos, setAbertos] = useState({}); // objeto: { idPergunta: true/false }

        function toggle(id) {
        setAbertos(prev => ({ 
            ...prev, 
            [id]: !prev[id] // alterna só o item clicado
        }));
        }

        const objFormulario = {
            nomeCategoria: "Salário e Benefícios",
            valorScore: 0.5,
            valorInten: 0.75,
        }

        const getBgClass = (valor) => {
            if (valor > 0.9) return "#277CDD";
            if (valor >= 0.75) return "#22B457";
            if (valor >= 0.6) return "#2DB61E";
            if (valor >= 0.4) return "#DDB927";
            if (valor >= 0.25) return "#FF3939";
            if (valor >= 0.1) return "#5F1D1D";
            return "#1E1E1E";
        };


        const htmlForm = <div>
            <div className="ml-[7vw]">
                <h1 className="text-primary font-title text-[2.5vw] text-center my-[2vh]">Formulário</h1>
                <div className="flex flex-row flex-wrap gap-[1vw]">    
                    <Squircle className="bg-secondary/30 w-[30vw] h-[35vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                        <h2 className="font-title text-primary text-[1.7vw] text-center mt-[1vw]">Salário e Benefícios</h2>
                        <div className="flex flex-row gap-[2vw]">
                            <div>
                                <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                    <div className="h-full rounded-xl" style={{ 
                                        width: `calc(${objFormulario.valorScore} * 12.5vw)`, 
                                        backgroundColor: `${getBgClass(objFormulario.valorScore)}` 
                                        }} />
                                        {/* 0.10 ou menos -> pessimo
                                        0.10 a 0.25 -> muito ruim
                                        0.25 a 0.4 -> ruim
                                        0.4 a 0.6 -> regular
                                        0.6 a 0.75 -> bom
                                        0.75 a 0.9 -> muito bom
                                        acima de 0.9 -> perfeito */}
                                    <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objFormulario.valorScore}</p>
                                </div>
                                <p className="text-primary text-center font-corpo text-[1vw]">Score Médio</p>
                            </div>
                            <div>
                                <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                    <div className="h-full rounded-xl" style={{ 
                                        width: `calc(${objFormulario.valorInten} * 12.5vw)`, 
                                        backgroundColor: `${getBgClass(objFormulario.valorInten)}`
                                    }} />
                                    <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objFormulario.valorInten}</p>
                                </div>
                                <p className="text-primary text-center font-corpo text-[1vw]">Intensidade Média</p>
                            </div>
                        </div>
                        <Squircle onClick={() => {document.getElementById('modalEdicao').showModal()}} cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[4vh] ml-[17vw]">
                            <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Detalhes</p>
                        </Squircle>
                    </Squircle>
                </div>
            </div>
            <BlocoPrincipalAdm pagina={4}/>

            <dialog id="modalEdicao" className="modal">
                <div className="modal-box max-w-90/100 ">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                    </form>
                        <h1 className="font-title md:text-[2vw] text-[6vw] text-primary">{objFormulario.nomeCategoria}</h1>
                        <div className="flex flex-row gap-[2vw] mt-[1vh]">
                            <div>
                                <div className="w-[42vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                    <div className="h-full rounded-xl" style={{ 
                                        width: `calc(${objFormulario.valorScore} * 42vw)`, 
                                        backgroundColor: `${getBgClass(objFormulario.valorScore)}` 
                                        }} />
                                        {/* 0.10 ou menos -> pessimo
                                        0.10 a 0.25 -> muito ruim
                                        0.25 a 0.4 -> ruim
                                        0.4 a 0.6 -> regular
                                        0.6 a 0.75 -> bom
                                        0.75 a 0.9 -> muito bom
                                        acima de 0.9 -> perfeito */}
                                    <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objFormulario.valorScore}</p>
                                </div>
                                <p className="text-primary text-center font-corpo text-[1vw]">Score Médio</p>
                            </div>
                            <div>
                                <div className="w-[42vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                    <div className="h-full rounded-xl" style={{ 
                                        width: `calc(${objFormulario.valorInten} * 42vw)`, 
                                        backgroundColor: `${getBgClass(objFormulario.valorInten)}`
                                    }} />
                                    <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objFormulario.valorInten}</p>
                                </div>
                                <p className="text-primary text-center font-corpo text-[1vw]">Intensidade Média</p>
                            </div>
                        </div>
                    <div className="mt-[2vh]">
                        <div className="flex flex-row gap-[68vw]">
                            <h2 className="font-title md:text-[1.7vw] text-[6vw] text-primary mt-5">Perguntas</h2>
                            <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[1vh]">
                                <PlusIcon size="4vh" weight="thin" className="my-auto" />
                                <p className="text-primary font-corpo my-auto">Adicionar</p>
                            </Squircle>
                        </div>
                        <div>
                            <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-auto h-[10vh] mt-[1vh] px-[2vw]">
                                <p className="text-primary font-corpo my-auto w-[82vw]">Pergunta 1 gdfhjkldfkg hhjklçdfglhkdfghkldfghklhkdfghkldfghlkhkldfghkldfghksgkldjkglkdfhklhglfkdhjgkldf hgjlj dfsgçolçdfghldf hkglç j?????</p>
                                <CaretDownIcon size="4vh" weight="thin" className="my-auto" />
                            </Squircle>



                            <Squircle cornerRadius={10} cornerSmoothing={1} className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh] ">
                                <div className="flex gap-[2vw] w-full">
                                    <div className="flex flex-col gap-[1vh] w-[65vw]">
                                        <label for={1} className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">Pergunta</label>
                                        <input name={1} type="text" id={1} placeholder="Digite pergunta aqui" value="Pergunta" className="bg-secondary/30 p-[2vh] md:w-full md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                                    </div>

                                    <div className="flex flex-col w-[30vw]">
                                        <label for={2} className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify">Tipo de resposta</label>
                                        <select name={2} id={2} className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary mt-[1vh]" onChange={(e) => setTipoCampo(e.target.value)}>
                                            <option key={0} value="Selecione uma opção" disabled hidden selected="selected">Selecione uma opção</option>
                                            <option key={1} value="Texto Curto" >Texto Curto</option>
                                            <option key={2} value="Texto Longo">Texto Longo</option>
                                            <option key={3} value="Lista de opções" >Lista de opções</option>
                                            <option key={4} value="Seletor de emoções" >Seletor de emoções</option>   
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    {tipoCampo === "Lista de opções" && (
                                        <div className="flex flex-row gap-[1vw] flex-wrap">
                                            {opcoes.map((valor, index) => (
                                                <div className="flex flex-col gap-[1vh] mt-[2vh] w-[25vw]">
                                                    <label for={index} className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">{`Opção ${index + 1}`}</label>
                                                    <input name={index} type="text" id={index} placeholder={`Opção ${index + 1}`} className="bg-secondary/30 p-[2vh] md:w-full md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                                                </div>
                                            ))}
                                            
                                            <Squircle onClick={adicionarOpcao} cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[7vw] h-[7vh] justify-center mt-[6vh]">
                                                <PlusIcon size="4vh" weight="thin" className="my-auto" />
                                            </Squircle>
                                        </div>
                                    )}
                                </div>
                            </Squircle>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>

        return htmlForm;
    }
}