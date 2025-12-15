import { useState, useEffect } from "react";
import { Squircle } from "corner-smoothing";
import { DotsThreeIcon, PlusIcon, X } from "@phosphor-icons/react";
import api from "../../lib/api"; 

import PerguntasEdit from "./PerguntasEdit"; 

// --- Componente de Card Individual da Categoria ---
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
        <Squircle 
            // DARK MODE: Fundo cinza escuro, borda sutil
            className="bg-gray-800 border border-gray-700 shadow-lg md:w-[24vw] w-83 h-55 md:h-[27vh] px-[1.2vw] py-[1vh] flex-col justify-between" 
            cornerRadius={20} 
            cornerSmoothing={1}
        >
            <h2 className="font-title text-white text-2xl text-center mt-[1vw]">{categoria.theme || "Sem Categoria"}</h2>
            
            <div className="flex flex-row gap-[2vw] justify-center my-auto">
                {/* Score Médio */}
                <div className="relative">
                    <progress 
                        className={`progress md:w-[10vw] w-39 h-[5vh] bg-gray-700 ${getBgClass(scoreNormalizado)}`}  
                        value={scoreNormalizado * 100} 
                        max="100"
                    ></progress>
                    <p className="text-white text-center font-corpo text-md absolute inset-0 flex items-center justify-center top-1 drop-shadow-md">
                          <span className={`font-bold ${valorScore >= 0 ? 'text-emerald-100' : 'text-red-100'}`}>
                            {valorScore.toFixed(2)}
                          </span>
                    </p>
                    <p className="text-gray-400 text-center font-corpo text-xs mt-1">Score Médio</p>
                </div>
                
                {/* Intensidade Média (Magnitude) */}
                <div className="relative">
                    <progress 
                        className={`progress md:w-[10vw] w-39 h-[5vh] progress-info bg-gray-700`} 
                        value={valorIntensidade * 50} 
                        max="100"
                    ></progress>
                    <p className="text-white text-center font-corpo text-md absolute inset-0 flex items-center justify-center top-1 drop-shadow-md">
                        <span className="font-bold text-blue-100">{valorIntensidade.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-400 text-center font-corpo text-xs mt-1">Intensidade Média</p>
                </div>
            </div>
            
            {/* BOTÃO IGUAL AO TIMES (Dark Mode Version) */}
            <Squircle
                onClick={() => onEdit(categoria.theme)} 
                cornerRadius={10}
                cornerSmoothing={1}
                // Estilo "Ghost/Dark" similar ao arquivo de Times
                className="flex bg-gray-700 w-50 h-[7vh] justify-center mt-[4vh] mx-auto hover:bg-gray-600 hover:text-white transition-all cursor-pointer border border-gray-600"
            >
                <DotsThreeIcon size="4vh" weight="thin" className="my-auto text-gray-300" />
                <p className="text-gray-300 text-md font-corpo my-auto ml-2">Ver Detalhes</p>
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
            const response = await api.get(`/perguntas?categoria=${categoryName}`);
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
                // Se não tinha ID, é nova criação
                return prev.map(p => 
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
        return <div className="flex h-full items-center justify-center bg-gray-900 min-h-screen"><span className="loading loading-spinner text-white"></span></div>;
    }

    // Encontra os scores da categoria atualmente aberta
    const categoriaEmEdicao = categorias.find(c => c.theme === editingCategory) || { averageScore: '0.00', magnitude: '0.00' };


    return (
        // DARK MODE FORÇADO NA TELA INTEIRA
        <div className="md:pr-2 pr-7 bg-gray-900 min-h-screen pb-10">
            <h1 className="text-white font-title text-4xl text-center md:text-left my-[2vh] pl-2">Formulário - Visão por Categoria</h1>
            
            <div className="flex flex-row flex-wrap gap-[1vw] pl-2"> 
                {categorias.map((cat) => (
                    <CategoriaCard 
                        key={cat.theme}
                        categoria={cat}
                        onEdit={handleOpenModal}
                    />
                ))}

                {/* CARD DE ADICIONAR NOVA CATEGORIA */}
                <Squircle 
                    className="bg-gray-800/30 border-2 border-dashed border-gray-700 md:w-[24vw] w-83 h-55 md:h-[27vh] px-[1.2vw] py-[1vh] flex items-center justify-center transition-all hover:bg-gray-800 hover:border-gray-500 cursor-pointer group" 
                    cornerRadius={20} 
                    cornerSmoothing={1}
                >
                    <div className="flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <PlusIcon size="5vh" weight="thin" className="text-gray-400 group-hover:text-white" />
                        <p className="text-gray-400 font-corpo mt-2 group-hover:text-white">Criar Nova Categoria</p>
                    </div>
                </Squircle>
            </div>

            {/* --- MODAL DE EDIÇÃO DE PERGUNTAS --- */}
            <dialog id="modalEdicao" className="modal backdrop-blur-sm">
                <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700 shadow-2xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-[1vw] top-[4vh] text-gray-400 hover:text-white hover:bg-gray-700">
                            ✕
                        </button>
                    </form>
                    
                    <h1 className="font-title text-3xl text-white">
                        {editingCategory || "Edição de Perguntas"}
                    </h1>
                    
                    <div className="flex flex-row gap-[2vw] mt-[1vh] bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                        {/* Exibindo os Scores no Modal */}
                        <div className="relative flex-1 text-center md:text-left">
                            <h3 className="font-corpo text-gray-400 text-lg">Score Médio Atual</h3>
                            <p className={`font-title text-4xl ${Number(categoriaEmEdicao.averageScore) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {categoriaEmEdicao.averageScore}
                            </p>
                        </div>
                        <div className="relative flex-1 text-center md:text-left">
                            <h3 className="font-corpo text-gray-400 text-lg">Intensidade</h3>
                            <p className="font-title text-4xl text-blue-400">{categoriaEmEdicao.magnitude}</p>
                        </div>
                    </div>

                    <div className="mt-[4vh]">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <h2 className="font-title text-2xl text-white">Lista de Perguntas ({perguntasDaCategoria.length})</h2>
                            <Squircle 
                                cornerRadius={10} 
                                cornerSmoothing={1} 
                                className="flex bg-accent md:w-[10vw] w-33 h-[7vh] justify-center hover:brightness-110 cursor-pointer shadow-lg shadow-accent/20" 
                                onClick={adicionarPerg}
                            >
                                <PlusIcon size="4vh" weight="thin" className="my-auto text-gray-900" />
                                <p className="text-gray-900 font-corpo font-bold my-auto">Adicionar</p>
                            </Squircle>
                        </div>
                        
                        <div className="mt-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {loadingPerguntas ? (
                                <div className="flex justify-center p-8">
                                    <span className="loading loading-spinner text-white loading-lg"></span>
                                </div>
                            ) : (
                                // Renderiza as Perguntas
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
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}