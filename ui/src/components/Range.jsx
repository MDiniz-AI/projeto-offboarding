// Seu componente Slider/Range

import MuitoRuim from '../assets/smiley-sad-thin-1.svg?react'
import Horrivel from '../assets/smiley-sad-thin.svg?react'
import MuitoBom from '../assets/smiley-wink-thin.svg?react'
import Bom from '../assets/smiley-thin2.svg?react'
import Regular from '../assets/smiley-meh-thin.svg?react'
import Ruim from '../assets/smiley-sad-thin2.svg?react'
import Incrivel from '../assets/smiley-thin.svg?react'
// import { FormProvider } from './context/FormContext.jsx'; // REMOVIDO: Não necessário aqui
// import { useContext } from "react"; // REMOVIDO: Será usado via hook customizado

// 1. IMPORTAÇÃO DO HOOK CUSTOMIZADO
import { useFormContext } from '../context/FormContext.jsx'; 
// (Ajuste o caminho se necessário)


export default (props) => {
    // 2. CHAMA O HOOK E DESESTRUTURA FUNÇÃO/ESTADO
    const { atualizarResposta, perguntas } = useFormContext(); 

    // 3. RECUPERA O VALOR ATUAL (CRUCIAL PARA PERSISTÊNCIA)
    // Busca a resposta de valor (resposta_valor) no estado persistente.
    const valorAtual = perguntas
        .flat()
        .find(p => p.id === props.id)?.resposta_valor;
    
    // Define o valor do slider. Se for null/undefined no estado, usa 4 como fallback.
    const sliderValue = valorAtual !== null && valorAtual !== undefined ? valorAtual : 4;

    return(
        <div className="flex flex-col gap-[1vh]">
            {/* CORREÇÃO: use 'htmlFor' em vez de 'for' */}
            <label htmlFor={props.id} className="font-corpo md:text-[1vw] text-[4vw] text-justify text-primary">{props.label}</label>
            
            <input 
                type="range" 
                name={props.id} 
                id={props.id} 
                min={1} 
                max="7" 
                // CORREÇÃO AQUI: Usa 'value' para ler do estado persistente (recomenda-se remover o defaultValue)
                value={sliderValue}
                // Função que salva: texto é null, valor é o número
                onChange={(e) => atualizarResposta(props.id, null, Number(e.target.value))} 
                
                className="range w-full h-[3vh] range-secondary bg-linear-to-r from-[#FF00004d] via-[#FFEB004d] to-[#15FF004d]" 
                step="1" 
            /> 
            <div className='flex flex-col gap-[.5vh]'>
                <div className='flex md:gap-[4vw] gap-[7vw] ml-[1vw]'>
                    <Horrivel className='w-[10vw] h-auto text-primary' />
                    <MuitoRuim className='w-[10vw] h-auto text-primary'/>
                    <Ruim className='w-[10vw] h-auto text-primary'/>
                    <Regular className='w-[10vw] h-auto text-primary'/>
                    <Bom className='w-[10vw] h-auto text-primary'/>
                    <MuitoBom className='w-[10vw] h-auto text-primary' />
                    <Incrivel className='w-[10vw] h-auto text-primary' /> 
                </div>
                {/* ... (O restante da sua marcação de texto) ... */}
                <div className='flex md:gap-[3vw] gap-[11vw]'>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] md:hidden'>Horrí vel</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] md:block hidden'>Horrível</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center md:w-[4vw] md:ml-0'>Muito <br/> Ruim</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[2vw] md:ml-0 ml-[-3vw]'>Ruim</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw]'>Regular</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[2vw] md:ml-[1vw] ml-[3vw]'>Bom</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[4vw]'>Muito <br /> Bom</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] ml-[-1vw] md:block hidden'>Incrível</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] ml-[-1vw] md:hidden'>Incrí vel</p>
                </div>
            </div>
        </div>
    )
}