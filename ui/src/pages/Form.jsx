import imgFundoPg from '../assets/form/fundo-pg.webp'
import imgFundoCa from '../assets/form/fundo-ca.webp'
import imgFundoCde from '../assets/form/fundo-cde.webp'
import imgFundoEio from '../assets/form/fundo-eio.webp'
import imgFundoFim from '../assets/form/fundo-fim.webp'
import imgFundoLg from '../assets/form/fundo-lg.webp'
import imgFundoLi from '../assets/form/fundo-li.webp'
import imgFundoPd from '../assets/form/fundo-pd.webp'

import BlocoPrincipal from '../components/BlocoPrincipal'
import FormRenderer from '../components/FormRenderer'
import { createContext, useContext, useEffect, useState } from 'react'
import {CaretRightIcon, CheckIcon, PaperPlaneTiltIcon, HouseIcon} from '@phosphor-icons/react';
import Perguntas from '../perguntas.json'
import { useNavigate } from "react-router-dom";

export const Contexto = createContext();

export default () => {
    const [perguntas, setPerguntas] = useState(Perguntas);
    const [secao, setSecao] = useState(2);
    const categorias = ["Perguntas gerais","Cultura e ambiente", "Liderança e gestão", "Estrutura, incentivos e oportunidades", "Comunicação e decisões estratégicas", "Perguntas específicas: Pedido de desligamento", "Perguntas específicas: Liderança", "Finalização"]
    const imgVet = [ imgFundoPg, imgFundoCa, imgFundoLg, imgFundoEio, imgFundoCde, imgFundoPd, imgFundoLi, imgFundoFim ]
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const navigate = useNavigate();

    function avancaPasso () {
        setSecao(secao+1);
        recuperaPerguntas();
    }

    function enviaDados(){
        setIsSubmitted(true)
    }

    function irParaHome(){
        navigate("/");
    }

    return(
        <Contexto.Provider value={{ perguntas, secao, avancaPasso, categorias, imgVet, enviaDados, isSubmitted, irParaHome}}>
            <App />
        </Contexto.Provider>
    )
}

function App(){

    const {perguntas, secao, avancaPasso, categorias, imgVet, enviaDados, isSubmitted, irParaHome} = useContext(Contexto)
    
    const html =<div>
            <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
            <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">{categorias[secao-2]}</p>
            <div className='bg-primary h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
            <form action="">
                <div className='mt-[5vh] h-[52vh] overflow-y-scroll w-[42vw] '>
                    <FormRenderer perguntas={perguntas[secao-2]} />
                </div>
                <div>
                    {secao < 9 ?
                        <button type="button" onClick={avancaPasso} className="flex gap-[32vw] bg-accent p-[1vw] rounded-xl mt-[3vh]" >
                            <p className="font-corpo text-[1vw] my-auto text-primary">Continuar</p>
                            <CaretRightIcon size="4vh" weight="thin" className="my-auto text-primary" />
                        </button>
                        :
                        <div>
                            <p className='text-primary w-[42vw] text-[.7vw] font-corpo'>Caso queira visualizar e/ou corrigir suas respostas, você pode navegar pelos blocos interagindo com os ícones do menu lateral. Ao enviar suas respostas, você concorda com os <a href="#" onClick={() => document.getElementById('modalTermos').showModal()}><u>Termos de Privacidade</u></a>.</p>
                            <button type="button" onClick={() => document.getElementById('modalConfirmar').showModal()} className="flex gap-[32vw] bg-accent p-[1vw] rounded-xl" >
                                <p className="font-corpo text-[1vw] my-auto text-primary">Finalizar</p>
                                <CheckIcon size="4vh" weight="thin" className="my-auto text-primary" />
                            </button>
                        </div>
                    }
                </div>
            </form>
            <dialog id="modalTermos" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                </form>
                <h3 className="font-title text-[2vw] text-primary">Termos de privacidade</h3>
                <p className="py-4 text-[1vw] font-corpo text-primary">Ao preencher este formulário, o(a) colaborador(a) desligado(a) concorda com os seguintes termos de uso e privacidade de suas respostas: <br /><br />
                                                1. Objetivo da Pesquisa <br />
                                                O objetivo desta pesquisa é coletar feedback honesto e construtivo sobre a experiência do colaborador na empresa (cultura, liderança, processos, remuneração e ambiente de trabalho) para fins de melhoria contínua e retenção de talentos. As informações fornecidas são cruciais para o desenvolvimento organizacional.<br /><br />
                                                2. Confidencialidade das Respostas<br />
                                                Uso Agregado: As respostas individuais serão tratadas com a máxima confidencialidade e serão prioritariamente analisadas de forma agregada (em conjunto com outras saídas) para identificar tendências e áreas de atenção.<br />
                                                Acesso Limitado: O acesso aos dados brutos e às respostas individuais será estritamente limitado aos profissionais de Recursos Humanos (RH) e, quando estritamente necessário para ações estratégicas (ex: mudanças estruturais), à Liderança Sênior (C-Level/Diretoria) relevante, mas sempre priorizando o anonimato do respondente.<br /><br />
                                                3. Anonimato<br />
                                                Líderes e Cargos Únicos: Embora reconheçamos que em posições de liderança ou cargos muito específicos o anonimato completo possa ser desafiador, garantimos que o feedback individual não será usado para retaliação ou julgamento pessoal e será usado </p>
            </div>
            </dialog> 

            <dialog id="modalConfirmar" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">✕</button>
                </form>
                <h3 className="font-title text-[2vw] text-primary">Confirmação</h3>
                <p className="py-4 text-[1vw] font-corpo text-primary">Você confirma o envio do formulário? Ao enviar o formulário, suas respostas não poderão ser mais editadas </p>
                <div className="modal-action">
                <form method="dialog" className='flex gap-[1vw]'>
                    <button onClick={enviaDados}className="btn btn-accent text-primary font-corpo text-[.9vw] w-[8vw] h-[6vh]"><PaperPlaneTiltIcon size="2.5vh" weight="thin" />Enviar</button>
                    <button className="btn btn-outline text-red-400  font-corpo text-[.9vw] w-[8vw] h-[6vh] btn-error">✕ Cancelar</button>
                </form>
                </div>
            </div>
            </dialog> 
        </div>
        

        const htmlSubmitted = <div className='flex flex-col gap-[4vh] justify-center mt-[-4vh]'>
            <h1 className="font-title text-[3.5vw] text-primary mx-auto">Obrigado!</h1>
            <p className="font-corpo w-[40vw] text-[1vw] text-center text-primary mx-auto mt-[-4vh]">Agradecemos por dedicar alguns minutos para compartilhar seu feedback e contribuir com a melhoria e a evolução do ambiente de trabalho. Desejamos muita sorte e sucesso no seu futuro.😊</p>
            <button onClick={irParaHome} className="btn btn-accent text-primary font-corpo text-[.9vw] w-[13vw] h-[6vh] mx-auto"><HouseIcon size="2.5vh" weight="thin" />Voltar ao Menu</button>
        </div>

    return <BlocoPrincipal codigo={isSubmitted ? htmlSubmitted : html} idPag={secao} imagemFundo={imgVet[secao-2]} />;
}