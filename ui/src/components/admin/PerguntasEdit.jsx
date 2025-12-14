import { CaretDownIcon, FloppyDiskIcon, PlusIcon, TrashIcon, SpinnerGap } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { Squircle } from "corner-smoothing"; 
import api from "../../lib/api.js";

// Lista de tipos de resposta para o Seletor
const TIPOS_RESPOSTA = [
    { value: "texto_curto", label: "Texto Curto" },
    { value: "texto_longo", label: "Texto Longo" },
    { value: "lista_opcoes", label: "Lista de opções" },
    { value: "seletor_emocoes", label: "Seletor de Emoções (Score)" }, 
];

// O estado inicial de uma nova pergunta
const NOVA_PERGUNTA_BASE = {
    id_pergunta: null, // Será preenchido se for edição
    texto_pergunta: "",
    categoria: "", // Será setado pelo componente pai (FormularioAdm)
    tipo_resposta: "",
    opcoes: [], // Array de strings ou JSON de opções
    condicao_saida: "todos", // 'voluntaria', 'involuntaria', 'todos'
    condicao_cargo: "todos", // 'lider', 'todos'
};


export default function PerguntasEdit({ perguntaInicial, categoriaPai, onDeleteSuccess, onSaveSuccess }) {
    
    // 1. ESTADO: Unifica todos os dados da pergunta
    const [perguntaData, setPerguntaData] = useState(
        perguntaInicial || { ...NOVA_PERGUNTA_BASE, categoria: categoriaPai }
    );
    const [aberto, setAberto] = useState(!perguntaInicial); // Se for nova, já vem aberto
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // Efeito para garantir que a categoria esteja correta
    useEffect(() => {
        if (!perguntaData.categoria && categoriaPai) {
            setPerguntaData(prev => ({ ...prev, categoria: categoriaPai }));
        }
    }, [categoriaPai]);

    // Função genérica para atualizar qualquer campo de texto
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerguntaData(prev => ({ ...prev, [name]: value }));
    };

    // Função para adicionar nova opção à lista
    const adicionarOpcao = () => {
        setPerguntaData(prev => ({ 
            ...prev, 
            opcoes: [...(prev.opcoes || []), ''] 
        }));
    };

    // Função para atualizar o texto de uma opção
    const handleOpcaoChange = (index, value) => {
        const novasOpcoes = [...perguntaData.opcoes];
        novasOpcoes[index] = value;
        setPerguntaData(prev => ({ ...prev, opcoes: novasOpcoes }));
    };
    
    // Função para remover uma opção
    const removerOpcao = (index) => {
        setPerguntaData(prev => ({ 
            ...prev, 
            opcoes: perguntaData.opcoes.filter((_, i) => i !== index) 
        }));
    };
    

    // --- LÓGICA DE SALVAR/ATUALIZAR (POST ou PUT) ---
    const handleSave = async () => {
        setLoading(true);
        setErro(null);

        // 1. Limpeza e Formatação dos dados
        let payload = { ...perguntaData };
        // O Sequelize espera que as opções sejam JSON.stringified se for TEXT.
        if (Array.isArray(payload.opcoes) && payload.tipo_resposta === 'lista_opcoes') {
            payload.opcoes = JSON.stringify(payload.opcoes.filter(o => o.trim() !== ''));
        } else {
            payload.opcoes = null; // Garante que opções não sejam enviadas para tipos de resposta que não precisam
        }
        
        // Remove campos nulos ou irrelevantes para o POST/PUT
        Object.keys(payload).forEach(key => payload[key] === null && delete payload[key]);


        try {
            let response;
            if (perguntaData.id_pergunta) {
                // EDIÇÃO (PUT)
                response = await api.put(`/perguntas/${perguntaData.id_pergunta}`, payload);
                alert(`Pergunta ${perguntaData.id_pergunta} atualizada com sucesso!`);
            } else {
                // CRIAÇÃO (POST)
                response = await api.post('/perguntas', payload);
                alert('Pergunta criada com sucesso!');
            }
            
            // Se salvar com sucesso, atualiza o estado com o objeto retornado (inclui novo ID se for POST)
            setPerguntaData(response.data);
            onSaveSuccess && onSaveSuccess(response.data);

        } catch (e) {
            const msg = e.response?.data?.msg || "Erro desconhecido ao salvar.";
            setErro(`Falha ao salvar: ${msg}`);
            console.error("Erro ao salvar pergunta:", e);
        } finally {
            setLoading(false);
            setAberto(false); // Fecha o painel após salvar
        }
    };
    
    // --- LÓGICA DE DELETAR (DELETE) ---
    const handleDelete = async () => {
        if (!perguntaData.id_pergunta || !window.confirm("Tem certeza que deseja apagar esta pergunta?")) {
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            await api.delete(`/perguntas/${perguntaData.id_pergunta}`);
            alert('Pergunta deletada com sucesso!');
            onDeleteSuccess && onDeleteSuccess(perguntaData.id_pergunta);
        } catch (e) {
            const msg = e.response?.data?.msg || "Erro desconhecido ao deletar.";
            setErro(`Falha ao deletar: ${msg}`);
            console.error("Erro ao deletar pergunta:", e);
        } finally {
            setLoading(false);
        }
    };


    // Determina o texto do título do card
    const cardTitle = perguntaData.texto_pergunta.substring(0, 80) || "Nova Pergunta...";

    // Verifica se precisa renderizar o campo de opções
    const showOpcoes = perguntaData.tipo_resposta === "lista_opcoes";
    
    // Determina se é uma nova pergunta (para exibir ícone diferente)
    const isNew = !perguntaData.id_pergunta;
    

    return (
        <div className="my-2">
            {/* --- CABEÇALHO (Clique para Abrir/Fechar) --- */}
            <Squircle 
                cornerRadius={10} 
                cornerSmoothing={1} 
                className="flex bg-secondary/50 w-auto h-[10vh] px-[2vw] cursor-pointer hover:bg-secondary/70 transition-all"
                onClick={() => setAberto((prev) => !prev)}
            >
                {isNew && <PlusIcon size="4vh" weight="bold" className="my-auto text-primary mr-2" />}
                <p className="text-primary font-corpo my-auto w-[82vw] truncate">
                    {cardTitle}
                </p>
                <CaretDownIcon size="4vh" weight="thin" className={`my-auto transition-transform ${aberto ? 'rotate-180' : 'rotate-0'}`} />
            </Squircle>


            {/* --- CORPO DE EDIÇÃO --- */}
            {aberto && 
            <Squircle cornerRadius={10} cornerSmoothing={1} className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh] shadow-inner mt-1">
                
                {/* 1. PERGUNTA e TIPO DE RESPOSTA */}
                <div className="flex gap-[2vw] w-full">
                    <div className="flex flex-col gap-[1vh] w-[65vw]">
                        <label htmlFor="texto_pergunta" className="font-corpo md:text-[1vw] text-[4vw] text-primary">Texto da Pergunta</label>
                        <input 
                            name="texto_pergunta" 
                            type="text" 
                            id="texto_pergunta" 
                            placeholder="Digite a pergunta aqui..." 
                            value={perguntaData.texto_pergunta} 
                            onChange={handleChange}
                            className="bg-secondary/30 p-[2vh] md:w-full w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
                        />
                    </div>

                    <div className="flex flex-col w-[30vw]">
                        <label htmlFor="tipo_resposta" className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify">Tipo de resposta</label>
                        <select 
                            name="tipo_resposta" 
                            id="tipo_resposta" 
                            value={perguntaData.tipo_resposta}
                            onChange={handleChange}
                            className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary mt-[1vh]" 
                        >
                            <option value="" disabled>Selecione uma opção</option>
                            {TIPOS_RESPOSTA.map(tipo => (
                                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-primary/70 mt-1">Categoria atual: {perguntaData.categoria || 'N/A'}</p>
                    </div>
                </div>

                {/* 2. CONDIÇÕES DE FILTRO (Condição de Saída e Cargo) */}
                <div className="flex gap-[2vw] w-full mt-[2vh] border-t border-primary/10 pt-4">
                    <div className="flex flex-col w-[30vw]">
                        <label htmlFor="condicao_saida" className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify">Filtrar por Tipo de Saída</label>
                        <select 
                            name="condicao_saida" 
                            id="condicao_saida" 
                            value={perguntaData.condicao_saida}
                            onChange={handleChange}
                            className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary mt-[1vh]" 
                        >
                            <option value="todos">Todos (Padrão)</option>
                            <option value="voluntaria">Apenas Saída Voluntária</option>
                            <option value="involuntaria">Apenas Saída Involuntária</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col w-[30vw]">
                        <label htmlFor="condicao_cargo" className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify">Filtrar por Cargo</label>
                        <select 
                            name="condicao_cargo" 
                            id="condicao_cargo" 
                            value={perguntaData.condicao_cargo}
                            onChange={handleChange}
                            className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary mt-[1vh]" 
                        >
                            <option value="todos">Todos (Padrão)</option>
                            <option value="lider">Apenas Liderança</option>
                        </select>
                    </div>
                </div>

                {/* 3. OPÇÕES DE RESPOSTA (Se "Lista de Opções" for selecionado) */}
                {showOpcoes && (
                    <div className="mt-[2vh] border-t border-primary/10 pt-4">
                        <label className="font-corpo md:text-[1vw] text-[4vw] text-primary block mb-2">Opções da Lista</label>
                        <div className="flex flex-row gap-[1vw] flex-wrap items-end">
                            {perguntaData.opcoes.map((opcao, index) => (
                                <div key={index} className="flex flex-col gap-[1vh] w-[25vw] relative">
                                    <label htmlFor={`opcao-${index}`} className="font-corpo md:text-[.8vw] text-[3vw] text-primary">{`Opção ${index + 1}`}</label>
                                    <input 
                                        name={`opcao-${index}`} 
                                        type="text" 
                                        id={`opcao-${index}`} 
                                        value={opcao}
                                        onChange={(e) => handleOpcaoChange(index, e.target.value)}
                                        placeholder={`Opção ${index + 1}`} 
                                        className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => removerOpcao(index)}
                                        className="absolute right-0 top-0 text-error hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            
                            {/* Botão Adicionar Opção */}
                            <Squircle onClick={adicionarOpcao} cornerRadius={10} cornerSmoothing={1} className="flex bg-accent hover:bg-accent/80 w-[4vw] h-[7vh] justify-center">
                                <PlusIcon size="4vh" weight="thin" className="my-auto text-primary" />
                            </Squircle>
                        </div>
                    </div>
                )}
                
                {/* Exibição de Erro */}
                {erro && (
                    <div className="text-error font-corpo text-sm mt-4 p-2 bg-error/10 border border-error rounded-lg">
                        {erro}
                    </div>
                )}

                {/* 4. BOTÕES DE AÇÃO (Salvar / Deletar) */}
                <div className="flex gap-[1vw] mx-auto justify-center mt-[4vh]">
                    
                    {/* Botão Salvar/Atualizar */}
                    <Squircle 
                        onClick={handleSave}
                        cornerRadius={10} 
                        cornerSmoothing={1} 
                        className={`flex bg-accent hover:bg-accent/80 w-[10vw] h-[7vh] justify-center transition-all ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                        {loading ? 
                            <SpinnerGap size="4vh" weight="bold" className="my-auto animate-spin text-primary" /> :
                            <FloppyDiskIcon size="4vh" weight="thin" className="my-auto text-primary" />
                        }
                        <p className="text-primary font-corpo my-auto ml-2">{perguntaData.id_pergunta ? 'Atualizar' : 'Salvar Novo'}</p>
                    </Squircle>
                    
                    {/* Botão Deletar (Só aparece se a pergunta existir) */}
                    {perguntaData.id_pergunta && (
                        <Squircle 
                            onClick={handleDelete}
                            cornerRadius={10} 
                            cornerSmoothing={1} 
                            className="flex bg-error hover:bg-error/80 w-[10vw] h-[7vh] justify-center transition-all"
                        >
                            <TrashIcon size="4vh" weight="thin" className="my-auto text-white" />
                            <p className="text-white font-corpo my-auto ml-2">Apagar</p>
                        </Squircle>
                    )}
                </div>
            </Squircle>}
        </div>
    );
}