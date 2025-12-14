// src/context/FormContext.jsx

import { createContext, useState, useContext } from 'react';

// 1. Criação e Exportação Nomeada do Contexto
export const FormContext = createContext(); 

// 2. Criação do Provedor (Componente que armazena o estado)
export function FormProvider({ children }) {
    // --- ESTADOS PERSISTENTES ---
    const [perguntas, setPerguntas] = useState([]); 
    const [secao, setSecao] = useState(1); 
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriasVisiveis, setCategoriasVisiveis] = useState([]);
    
    // NOVO ESTADO: TOKEN (Essencial para a submissão)
    const [token, setToken] = useState(null); 

    // FUNÇÃO DE ATUALIZAÇÃO MOVIDA PARA O CONTEXTO
    function atualizarResposta(idPergunta, resposta_texto, resposta_valor) {
        setPerguntas((prev) =>
            prev.map((secaoArr) =>
                secaoArr.map((p) =>
                    p.id === idPergunta
                        ? {
                            ...p,
                            // Garante que o texto seja atualizado APENAS se estiver presente
                            ...(resposta_texto !== undefined && { resposta_texto }),
                            // Garante que o valor (escala) seja atualizado APENAS se presente
                            ...(resposta_valor !== undefined && { resposta_valor }),
                          }
                        : p
                )
            )
        );
    }

    const value = {
        perguntas, setPerguntas,
        secao, setSecao,
        isSubmitted, setIsSubmitted,
        isLoading, setIsLoading,
        categoriasVisiveis, setCategoriasVisiveis,
        
        // EXPOR O TOKEN E O SETTER (SOLUÇÃO PARA 'setToken is not a function')
        token, setToken,
        
        // EXPOR A FUNÇÃO DE ATUALIZAÇÃO
        atualizarResposta 
    };

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// 3. Hook Customizado para usar o Contexto em qualquer lugar
export const useFormContext = () => {
    return useContext(FormContext);
};