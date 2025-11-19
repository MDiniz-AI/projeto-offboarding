import BlocoPrincipalAdm from "../components/BlocoPrincipalAdm.jsx"
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Squircle } from "corner-smoothing"; 
import { DotsThreeIcon } from "@phosphor-icons/react";


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
        const valorScore = 0.5;
        const valorInten = 0.75;

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
                                        width: `calc(${valorScore} * 12.5vw)`, 
                                        backgroundColor: `${getBgClass(valorScore)}` 
                                        }} />
                                        {/* 0.10 ou menos -> pessimo
                                        0.10 a 0.25 -> muito ruim
                                        0.25 a 0.4 -> ruim
                                        0.4 a 0.6 -> regular
                                        0.6 a 0.75 -> bom
                                        0.75 a 0.9 -> muito bom
                                        acima de 0.9 -> perfeito */}
                                    <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{valorScore}</p>
                                </div>
                                <p className="text-primary text-center font-corpo text-[1vw]">Score Médio</p>
                            </div>
                            <div>
                                <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                    <div className="h-full rounded-xl" style={{ 
                                        width: `calc(${valorInten} * 12.5vw)`, 
                                        backgroundColor: `${getBgClass(valorInten)}`
                                    }} />
                                    <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{valorInten}</p>
                                </div>
                                <p className="text-primary text-center font-corpo text-[1vw]">Intensidade Média</p>
                            </div>
                        </div>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[4vh] ml-[17vw]">
                            <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Detalhes</p>
                        </Squircle>
                    </Squircle>
                </div>
            </div>
            <BlocoPrincipalAdm pagina={2}/>
        </div>

        return htmlForm;
    }
}