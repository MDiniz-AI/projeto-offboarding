// src/components/InputCurto.jsx

// 1. Importação do Hook Customizado
import { useFormContext } from '../context/FormContext.jsx'; 
// OBS: Ajuste o caminho '../context/FormContext.jsx' conforme sua estrutura.


export default (props) => {
    // 2. Chama o hook para acessar a função de atualização e o estado 'perguntas'.
    const { atualizarResposta, perguntas } = useFormContext(); 

    // 3. ENCONTRA O VALOR ATUAL (CRUCIAL PARA PERSISTÊNCIA)
    // Busca a resposta de texto no array 'perguntas' salvo no contexto.
    const valorAtual = perguntas
        .flat() 
        .find(p => p.id === props.id)?.resposta_texto || '';
    
    // Se o valor estiver vazio, ele retorna uma string vazia (''), 
    // o que é ideal para inputs controlados.

    return (
        <div className="flex flex-col gap-[1vh]">
            {/* CORREÇÃO: Usando htmlFor (correto no React) */}
            <label 
                htmlFor={props.id} 
                className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary"
            >
                {props.label}
            </label>
            <input 
                name={props.id} 
                type={props.tipo} 
                id={props.id} 
                placeholder={props.placeholder} 
                
                // CAMPO CONTROLADO: Liga o valor do input ao estado persistente.
                value={valorAtual} 
                
                // ATUALIZAÇÃO: Chama a função que salva no Contexto.
                // O terceiro argumento é 'null' porque este é um campo de texto.
                onChange={(e) => atualizarResposta(props.id, e.target.value, null)} 
                
                className="bg-secondary/30 p-[2vh] md:w-[40vw] md:mx-0 w-[97vw] mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
            />
        </div>
    )
}