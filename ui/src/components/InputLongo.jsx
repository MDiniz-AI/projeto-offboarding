// Seu componente InputLongo.jsx (Textarea)

import { useContext } from "react";
// 1. Importação do Hook Customizado
import { useFormContext } from '../context/FormContext.jsx'; 
// (Ajuste o caminho '../context/FormContext.jsx' conforme necessário)


export default (props) => {
    // 2. CHAMA O HOOK E DESESTRUTURE O ESTADO 'perguntas'
    const { atualizarResposta, perguntas } = useFormContext();
    
    // 3. ENCONTRA O VALOR ATUAL (CRUCIAL PARA PERSISTÊNCIA)
    // Procuramos a resposta atual no array aninhado 'perguntas' que está no contexto.
    const valorAtual = perguntas
        .flat() // Achata as seções para buscar a pergunta
        .find(p => p.id === props.id)?.resposta_texto || ''; // Busca por ID e pega o texto
    

    return (
        <div className="flex flex-col gap-[1vh] text-justify">
            <label htmlFor={props.id} className="font-corpo md:text-[1vw] text-[4vw] text-primary">{props.label}</label>
            <textarea 
                name={props.id} 
                id={props.id} 
                placeholder={props.placeholder} 
                
                // CORREÇÃO: LIGAR O CAMPO AO ESTADO PERSISTENTE
                value={valorAtual} 
                
                // Passando null para o valor numérico (correto para texto)
                onChange={(e) => atualizarResposta(props.id, e.target.value, null)} 
                
                className="bg-secondary/30 p-[2vh] h-[15vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
            ></textarea>
        </div>
    )
}