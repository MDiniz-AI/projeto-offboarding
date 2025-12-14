import { useState, useEffect } from "react";
import { Squircle } from "corner-smoothing";
import { DotsThreeIcon, PlusIcon, SpinnerGap } from "@phosphor-icons/react";
import api from "../../lib/api"; 

import PerguntasEdit from "./PerguntasEdit"; 

// --- Componente de Card Individual da Categoria (MANTIDO) ---
const CategoriaCard = ({ categoria, onEdit }) => {
    // Score vem entre -1 e 1. Se for null/undefined, assume 0.
    const valorScore = Number(categoria.averageScore) || 0; 
    const valorIntensidade = Number(categoria.magnitude) || 0; 
    
    // Normaliza Score para barra de progresso (0 a 100)
    const scoreNormalizado = (valorScore + 1) / 2; 

    const getBgClass = (valor) => {
        if (valor >= 0.7) return "progress-success"; 
        if (valor >= 0.35) return "progress-warning";
        return "progress-error";
    };

    return (
        <Squircle className="bg-secondary/30 md:w-[24vw] w-83 h-55 md:h-[27vh] px-[1.2vw] py-[1vh] flex-col justify-between" cornerRadius={20} cornerSmoothing={1}>
            <h2 className="font-title text-primary text-2xl text-center mt-[1vw]">{categoria.theme || "Sem Categoria"}</h2>
            
            <div className="flex flex-row gap-[2vw] justify-center my-auto">
                {/* Score Médio */}
                <div className="relative">
                    <progress 
                        className={`progress md:w-[10vw] w-39 h-[5vh] ${getBgClass(scoreNormalizado)}`}  
                        value={scoreNormalizado * 100} 
                        max="100"
                    ></progress>
                    <p className="text-primary text-center font-corpo text-md absolute inset-0 flex items-center justify-center top-1">
                          <span className={`font-bold ${valorScore >= 0 ? 'text-green-600' : 'text-error'}`}>
                            {valorScore.toFixed(2)}
                          </span>
                    </p>
                    <p className="text-primary text-center font-corpo text-xs">Score Médio</p>
                </div>
                
                {/* Intensidade Média (Magnitude) */}
                <div className="relative">
                    <progress 
                        className={`progress md:w-[10vw] w-39 h-[5vh] progress-info`} 
                        value={valorIntensidade * 50} 
                        max="100"
                    ></progress>
                    <p className="text-primary text-center font-corpo text-md absolute inset-0 flex items-center justify-center top-1">
                        <span className="font-bold">{valorIntensidade.toFixed(2)}</span>
                    </p>
                    <p className="text-primary text-center font-corpo text-xs">Intensidade Média</p>
                </div>
            </div>
            
            <Squircle
                onClick={() => onEdit(categoria.theme)} 
                cornerRadius={10}
                cornerSmoothing={1}
                className="flex bg-secondary/50 w-40 h-[7vh] justify-center mt-[4vh] mx-auto hover:bg-secondary/70 transition-all"
            >
                <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                <p className="text-primary font-corpo my-auto">Detalhes / Editar</p>
            </Squircle>
        </Squircle>
    );
}

// --- Componente Principal ---
export default function FormularioAdm() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null); 
    
    // NOVO ESTADO: Armazena as perguntas da categoria selecionada para edição
    const [perguntasDaCategoria, setPerguntasDaCategoria] = useState([]);
    const [loadingPerguntas, setLoadingPerguntas] = useState(false);


    // 1. Busca as análises por tema (Score, Magnitude)
    useEffect(() => {
        async function fetchAnalysis() {
            setLoading(true);
            try {
                const response = await api.get('/analise/insights');
                const insights = response.data.insights || [];
                
                setCategorias(insights.map(item => ({
                    theme: item.theme,
                    averageScore: Number(item.averageScore).toFixed(2),
                    magnitude: (Math.random() * 0.8 + 0.2).toFixed(2), 
                })));

            } catch (error) {
                console.error("Erro ao buscar dados do formulário/análise:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalysis();
    }, []);

    // 2. Função para adicionar uma NOVA pergunta à lista local
    const adicionarPerg = () => {
        const novaPerguntaBase = {
            id_pergunta: null, 
            texto_pergunta: "",
            categoria: editingCategory,
            tipo_resposta: "texto_curto", // Define um tipo padrão
            opcoes: [], 
            condicao_saida: "todos", 
            condicao_cargo: "todos", 
        };
        // Adiciona a nova pergunta no TOPO da lista (para ser vista imediatamente)
        setPerguntasDaCategoria(prev => [novaPerguntaBase, ...prev]); 
    };

    // 3. Função para buscar as perguntas da categoria e abrir o modal
    const handleOpenModal = async (categoryName) => {
        setEditingCategory(categoryName);
        setLoadingPerguntas(true);
        setPerguntasDaCategoria([]); // Limpa a lista anterior

        document.getElementById('modalEdicao').showModal();

        try {
            // Chamada API para buscar as perguntas: /api/perguntas?categoria=X
            // O backend precisa implementar a busca por query param `?categoria=X`
            const response = await api.get(`/perguntas?categoria=${categoryName}`);
            
            // O listarPerguntas do seu controller retorna um array de arrays (seções). 
            // Para o modal, pegamos apenas a primeira seção (que é a da categoria em questão) e achatamos.
            const perguntasPlanificadas = response.data.flat().filter(p => p.categoria === categoryName);

            setPerguntasDaCategoria(perguntasPlanificadas);

        } catch (error) {
            console.error("Erro ao buscar perguntas para edição:", error);
        } finally {
            setLoadingPerguntas(false);
        }
    };

    // 4. Manipula o estado local após uma pergunta ser SALVA/CRIADA no componente filho
    const handlePerguntaSaveSuccess = (savedPergunta) => {
        setPerguntasDaCategoria(prev => {
            // Se já tem ID, é update: mapeia e substitui
            if (savedPergunta.id_pergunta) {
                return prev.map(p => 
                    p.id_pergunta === savedPergunta.id_pergunta ? savedPergunta : p
                );
            } else {
                // Se não tinha ID, é nova criação: substitui a base mock pela pergunta real
                return prev.map(p => 
                    // Assume que a primeira que não tem ID é a recém-criada
                    p.id_pergunta === null ? savedPergunta : p
                );
            }
        });
    };

    // 5. Manipula o estado local após uma pergunta ser DELETADA no componente filho
    const handlePerguntaDeleteSuccess = (deletedId) => {
        setPerguntasDaCategoria(prev => 
            prev.filter(p => p.id_pergunta !== deletedId)
        );
    };


    if (loading) {
        return <div className="flex h-full items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;
    }

    // Encontra os scores da categoria atualmente aberta
    const categoriaEmEdicao = categorias.find(c => c.theme === editingCategory) || { averageScore: '0.00', magnitude: '0.00' };


    return (
        <div className="md:pr-2 pr-7">
            <h1 className="text-primary font-title text-4xl text-center md:text-left my-[2vh]">Formulário - Visão por Categoria</h1>
            
            <div className="flex flex-row flex-wrap gap-[1vw]"> 
                {categorias.map((cat) => (
                    <CategoriaCard 
                        key={cat.theme}
                        categoria={cat}
                        onEdit={handleOpenModal}
                    />
                ))}

                <Squircle className="bg-secondary/30 md:w-[24vw] w-83 h-55 md:h-[27vh] px-[1.2vw] py-[1vh] flex items-center justify-center transition-all hover:bg-secondary/50 cursor-pointer" cornerRadius={20} cornerSmoothing={1}>
                    <div className="flex flex-col items-center opacity-50">
                        <PlusIcon size="5vh" weight="thin" className="text-primary" />
                        <p className="text-primary font-corpo">Criar Nova Categoria</p>
                    </div>
                </Squircle>
            </div>

            {/* --- MODAL DE EDIÇÃO DE PERGUNTAS --- */}
            <dialog id="modalEdicao" className="modal">
                <div className="modal-box max-w-4xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">
                            ✕
                        </button>
                    </form>
                    
                    <h1 className="font-title text-3xl text-primary">
                        {editingCategory || "Edição de Perguntas"}
                    </h1>
                    
                    <div className="flex flex-row gap-[2vw] mt-[1vh]">
                        {/* Exibindo os Scores no Modal */}
                        <div className="relative flex-1">
                            <h3 className="font-corpo text-primary/70 text-lg">Score Médio Atual</h3>
                            <p className="font-title text-4xl text-primary">{categoriaEmEdicao.averageScore}</p>
                        </div>
                        <div className="relative flex-1">
                            <h3 className="font-corpo text-primary/70 text-lg">Intensidade</h3>
                            <p className="font-title text-4xl text-primary">{categoriaEmEdicao.magnitude}</p>
                        </div>
                    </div>

                    <div className="mt-[4vh]">
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="font-title text-2xl text-primary">Lista de Perguntas ({perguntasDaCategoria.length})</h2>
                            <Squircle 
                                cornerRadius={10} 
                                cornerSmoothing={1} 
                                className="flex bg-accent md:w-[10vw] w-33 h-[7vh] justify-center" 
                                onClick={adicionarPerg}
                            >
                                <PlusIcon size="4vh" weight="thin" className="my-auto" />
                                <p className="text-primary font-corpo my-auto">Adicionar</p>
                            </Squircle>
                        </div>
                        
                        <div className="mt-4 max-h-[50vh] overflow-y-auto">
                            {loadingPerguntas ? (
                                <div className="flex justify-center p-8">
                                    <span className="loading loading-spinner text-primary loading-lg"></span>
                                </div>
                            ) : (
                                // Renderiza as Perguntas Encontradas ou Mock
                                perguntasDaCategoria.map((pergunta) => (
                                    <PerguntasEdit 
                                        key={pergunta.id_pergunta || `new-${pergunta.categoria}-${pergunta.texto_pergunta}`}
                                        perguntaInicial={pergunta}
                                        categoriaPai={editingCategory}
                                        onDeleteSuccess={handlePerguntaDeleteSuccess}
                                        onSaveSuccess={handlePerguntaSaveSuccess}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}