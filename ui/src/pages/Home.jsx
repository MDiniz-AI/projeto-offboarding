import BlocoPrincipal from "../components/BlocoPrincipal"
import {ClockCountdownIcon, LockSimpleIcon, LegoSmileyIcon, ChartLineIcon, CaretRightIcon } from '@phosphor-icons/react';
import { Squircle } from 'corner-smoothing';
import { createContext, useContext, useState, useEffect } from "react";
import InputCurto from "../components/InputCurto";
import GoogleLogo from '../assets/Google__G__logo.svg'
import MicrosoftLogo from '../assets/Microsoft_logo.svg'
import imgFundoHm from '../assets/fundo-pg1.webp';
import imgFundoLog from '../assets/fundo-pg2.webp'
import { useNavigate, useSearchParams } from "react-router-dom";



export const Contexto = createContext();

export default () => {

    const [searchParams, setSearchParams] = useSearchParams();
    let secaoQuery = Number(searchParams.get("secao") == null ? null : searchParams.get("secao"));
    if (secaoQuery == null || isNaN(secaoQuery) || secaoQuery < 1 || secaoQuery > 0) secaoQuery = 0

    const [pagAtual, setPagAtual] = useState(secaoQuery)
    const imgFundo = [imgFundoHm, imgFundoLog]
    const navigate = useNavigate();

    useEffect(() => {
        let novaSecao = Number(searchParams.get("secao"));
        if (novaSecao == null || isNaN(secaoQuery) || secaoQuery > 9 || secaoQuery < 2) secaoQuery = 2
        setPagAtual(novaSecao ?? 0);
    }, [searchParams]);


    function avancaPagina(){
        setPagAtual(pagAtual + 1)
    }

    function irParaForm(){
        navigate("/form");
    }

    return(
        <Contexto.Provider value={{ pagAtual }}>
                    <App />
        </Contexto.Provider>
    )

    function App() {

        const { pagAtual } = useContext(Contexto);

        const htmlInicio = <div className="mt-[4vh] flex flex-col">
                        <h1 className="font-title md:text-[3.5vw] text-[8vw] text-center md:text-left text-primary">Pesquisa de offboarding</h1>
                        <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-[4vw] md:text-justify text-center text-primary mx-auto md:mx-0">Sua opinião é muito importante para nós. 💙 <br/> Esta pesquisa nos ajuda a entender melhor sua experiência e a aprimorar continuamente nosso ambiente de trabalho. ✍️</p>
                        <div className="mt-[2vh] flex flex-col gap-[2.5vh] mx-auto">
                            <div className="flex gap-[2.5vh]">
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <ClockCountdownIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary">Leva 10 Minutos</p>
                                </Squircle>
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <LockSimpleIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary text-center">Anonimização de respostas</p>
                                </Squircle>
                            </div>
                            
                            <div className="flex gap-[2.5vh]">
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <LegoSmileyIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary">Promove melhorias</p>
                                </Squircle>
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <ChartLineIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary text-center">Identifica tendências</p>
                                </Squircle>
                            </div>
                        </div>
                        <div className="mt-[8vh]">
                            <button onClick={avancaPagina} className='flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 mb-[1vh] md:mb-0'>
                                <p className='font-corpo md:text-[1vw] text-[2vh] my-auto text-primary'> Continuar </p>
                                <CaretRightIcon size="3.5vh" weight="thin" className='my-auto text-primary'/>
                            </button>
                        </div>
                    </div>


            const htmlLogin = <div>
                    <h1 className="font-title md:text-[3.5vw] text-[8vw] text-center md:text-left text-primary">Pesquisa de offboarding</h1>
                    <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-[4vw] md:text-justify text-center text-primary mx-auto md:mx-0">Perfeito! Vamos começar digitando o seu endereço de email preferido ✉️. <br/> Se preferir, você pode logar com contas da Microsoft e Google.</p>
                    <div className='bg-[#1d1d1e] h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
                    <form action="" className="mt-[3vh] flex flex-col md:gap-[32vh] gap-[36vh]">
                        <div> 
                            <InputCurto label="Email" placeholder="Digite o seu email aqui" id="input1" tipo="email"/>
                            <div className='flex gap-[1.5vw] mt-[2vh] justify-center'>
                                <button><img src={GoogleLogo} alt="Logo do google" className='md:w-[3.2vw] w-[13vw] bg-secondary p-[1.8vh] rounded-xl'/></button>
                                <button><img src={MicrosoftLogo} alt="Logo da Microsoft" className='md:w-[3.2vw] w-[13vw] bg-secondary p-[1.8vh] rounded-xl'/></button>
                            </div>
                        </div>
                        <button onClick={irParaForm} className='flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 mb-[1vh] md:mb-0 md:mt-0 mt-[1vh]'>
                            <p className='font-corpo md:text-[1vw] text-[2vh] my-auto text-primary'>Continuar</p>
                            <CaretRightIcon size="4vh" weight="thin" className='my-auto text-primary'/>
                        </button>
                    </form>
                </div>

            //  
        return (
        <BlocoPrincipal codigo={pagAtual == 0 ? htmlInicio : htmlLogin} idPag={pagAtual} imagemFundo={imgFundo[pagAtual]} />
        )
    }
}