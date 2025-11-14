import BlocoPrincipal from "../components/BlocoPrincipal"
import {ClockCountdownIcon, LockSimpleIcon, LegoSmileyIcon, ChartLineIcon, CaretRightIcon } from '@phosphor-icons/react';
import { Squircle } from 'corner-smoothing';
import { createContext, useContext, useState } from "react";
import InputCurto from "../components/InputCurto";
import GoogleLogo from '../assets/Google__G__logo.svg'
import MicrosoftLogo from '../assets/Microsoft_logo.svg'
import imgFundoHm from '../assets/fundo-pg1.webp';
import imgFundoLog from '../assets/fundo-pg2.webp'
import { useNavigate } from "react-router-dom";


export const Contexto = createContext();

export default () => {

    const [pagAtual, setPagAtual] = useState(0)
    const imgFundo = [imgFundoHm, imgFundoLog]
    const navigate = useNavigate();

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

        const htmlInicio = <div className="mt-[4vh]">
                        <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
                        <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">Sua opinião é muito importante para nós. 💙 <br/> Esta pesquisa nos ajuda a entender melhor sua experiência e a aprimorar continuamente nosso ambiente de trabalho. ✍️</p>
                        <div className="mt-[2vh] flex flex-col gap-[2.5vh]">
                            <div className="flex gap-[2.5vh]">
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <ClockCountdownIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary">Leva 10 Minutos</p>
                                </Squircle>
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <LockSimpleIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary">Anonimização de respostas</p>
                                </Squircle>
                            </div>
                            
                            <div className="flex gap-[2.5vh]">
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <LegoSmileyIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary">Promove melhorias</p>
                                </Squircle>
                                <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                    <ChartLineIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                    <p className="font-corpo text-[2vh] mx-auto text-primary">Identifica tendências</p>
                                </Squircle>
                            </div>
                        </div>
                        <div className="mt-[10vh]">
                            <button onClick={avancaPagina} className='flex gap-[32vw] bg-accent p-[1vw] rounded-xl'>
                                <p className='font-corpo text-[1vw] my-auto text-primary'> Continuar </p>
                                <CaretRightIcon size="4vh" weight="thin" className='my-auto text-primary'/>
                            </button>
                        </div>
                    </div>


            const htmlLogin = <div>
                    <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
                    <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">Perfeito! Vamos começar digitando o seu endereço de email preferido ✉️. <br/> Se preferir, você pode logar com contas da Microsoft e Google.</p>
                    <div className='bg-[#1d1d1e] h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
                    <form action="" className="mt-[3vh] flex flex-col gap-[32vh]">
                        <div> 
                            <InputCurto label="Email" placeholder="Digite o seu email aqui" id="input1" tipo="email"/>
                            <div className='flex gap-[1.5vw] mt-[2vh] justify-center'>
                                <button><img src={GoogleLogo} alt="Logo do google" className='w-[3.2vw] bg-secondary p-[1.8vh] rounded-xl'/></button>
                                <button><img src={MicrosoftLogo} alt="Logo da Microsoft" className='w-[3.2vw] bg-secondary p-[1.8vh] rounded-xl'/></button>
                            </div>
                        </div>
                        <button onClick={irParaForm} className='flex gap-[32vw] bg-accent p-[1vw] rounded-xl'>
                            <p className='font-corpo text-[1vw] my-auto text-primary'>Continuar</p>
                            <CaretRightIcon size="4vh" weight="thin" className='my-auto text-primary'/>
                        </button>
                    </form>
                </div>

        return (
        <BlocoPrincipal codigo={pagAtual == 0 ? htmlInicio : htmlLogin} idPag={pagAtual} imagemFundo={imgFundo[pagAtual]} />
        )
    }
}