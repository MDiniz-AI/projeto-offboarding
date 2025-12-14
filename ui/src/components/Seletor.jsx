// Seu componente Select/Dropdown (Ex: SelectSimples.jsx)

// Importações a serem corrigidas/removidas:
// import { FormProvider } from './context/FormContext.jsx'; // REMOVIDO: Não necessário aqui
// import { useContext } from "react"; // REMOVIDO: Será usado via hook customizado

// 1. IMPORTAÇÃO DO HOOK CUSTOMIZADO
import { useFormContext } from '../context/FormContext.jsx'; 
// (Ajuste o caminho se necessário)


export default (props) => {
    // 2. CHAMA O HOOK E DESESTRUTURA FUNÇÃO/ESTADO
    const { atualizarResposta, perguntas } = useFormContext(); 

    // 3. RECUPERA O VALOR ATUAL (CRUCIAL PARA PERSISTÊNCIA)
    // Busca a resposta de texto (resposta_texto) no estado persistente.
    const valorAtual = perguntas
        .flat()
        .find(p => p.id === props.id)?.resposta_texto || '';
    
    // Define a opção que serve como placeholder inicial
    const placeholderOption = props.placeholder;

    return (
        <div className="flex flex-col gap-[1vh]">
            {/* CORREÇÃO: use 'htmlFor' em vez de 'for' */}
            <label 
                htmlFor={props.id} 
                className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify"
            >
                {props.label}
            </label>
            
            <select 
                name={props.id} 
                id={props.id} 
                // CORREÇÃO: O valor do SELECT deve ser controlado pelo estado
                value={valorAtual || ''} 
                onChange={(e) => atualizarResposta(props.id, e.target.value, null)} 
                className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
            >
                {/* Opção de placeholder/seleção inicial */}
                <option 
                    key="placeholder" 
                    value="" 
                    disabled
                    // Remove 'selected' e 'hidden' se estiver usando o 'value' do React
                >
                    {placeholderOption}
                </option>
                
                {/* Opções mapeadas */}
                {props.opcoes.map((opc, index) => (
                    <option className="select-option" key={index} value={opc}>
                        {opc}
                    </option>
                ))}
            </select>
        </div>
    );
};