import imgFundo from '../assets/fundo-pg3.webp'
import BlocoPrincipal from '../components/BlocoPrincipal'
import FormRenderer from '../components/FormRenderer'
import BotaoGrande from '../components/BotaoGrande'
import { createContext, useContext, useEffect, useState } from 'react'
import {CaretRightIcon} from '@phosphor-icons/react';
import Perguntas from '../perguntas.json'

export const Contexto = createContext();

export default () => {
    const [perguntas, setPerguntas] = useState(Perguntas);
    const [secao, setSecao] = useState(2);
    const [categorias ] = useState(["Perguntas gerais","Cultura e ambiente", "Liderança e gestão", "Estrutura, incentivos e oportunidades", "Comunicação e decisões estratégicas", "Perguntas específicas: Pedido de desligamento", "Perguntas específicas: Liderança", "Finalização"])

    function avancaPasso () {
        setSecao(secao+1);
        recuperaPerguntas();
    }

    return(
        <Contexto.Provider value={{ perguntas, secao, avancaPasso, categorias}}>
            <App />
        </Contexto.Provider>
    )
}

function App(){

    const {perguntas, secao, avancaPasso, categorias} = useContext(Contexto)
    
    const html = <div>
            <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
            <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">{categorias[secao-2]}</p>
            <div className='bg-primary h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
            <form action="">
                <div className='mt-[5vh] h-[52vh] overflow-scroll w-[90vh] '>
                    <FormRenderer perguntas={perguntas[secao-2]} />
                </div>
                <div className='mt-[3vh]'>
                    <button type="button" onClick={avancaPasso} className="flex gap-[32vw] bg-accent p-[1vw] rounded-xl" >
                        <p className="font-corpo text-[1vw] my-auto text-primary">Continuar</p>
                        <CaretRightIcon size="4vh" weight="thin" className="my-auto text-primary" />
                    </button>
                </div>
            </form>
        </div>

    return <BlocoPrincipal codigo={html} idPag={secao} imagemFundo={imgFundo} />;
}